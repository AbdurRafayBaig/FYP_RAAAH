import { config } from '../../config.js';
import { classifyCrowd } from '../../domain.js';
import { withTransaction } from '../../data/db.js';
import { getCache, getCacheKind, cacheKeys } from '../../data/cache.js';
import * as checkins from '../../data/repositories/checkinRepository.js';
import * as sessions from '../../data/repositories/sessionRepository.js';
import { refreshWeatherAhead } from '../destinations/weatherService.js';
import * as destinations from '../../data/repositories/destinationRepository.js';
import * as users from '../../data/repositories/userRepository.js';
import { HttpError } from '../../middleware/errors.js';

// Crowd Monitoring Service (Component Diagram, Fig. 37; DFD Level 2, Fig. 41)

// Serverless instances without Redis each keep their own copy, and a check-in recorded by one instance
// reaches the others only when their copy expires, so the copy is kept short there (SRS 3.3.2).
const SERVERLESS_MEMORY_TTL_SECONDS = 10;
const cacheTtl = () =>
  config.isServerless && getCacheKind() === 'memory'
    ? SERVERLESS_MEMORY_TTL_SECONDS
    : Math.max(config.crowdRefreshSeconds * 3, 60);

// DFD 2.4 Calculate Active Visitors + 2.5 Classify Crowd Level
export async function recalculate(destinationId = null) {
  const counts = await checkins.countActiveByDestination(destinationId);
  const capacities = (await destinations.listCapacities()).filter(
    (d) => destinationId === null || d.destination_id === destinationId,
  );
  const results = new Map();
  for (const { destination_id: id, capacity_threshold: capacityThreshold } of capacities) {
    const activeVisitors = counts.get(id) || 0;
    results.set(id, {
      activeVisitors,
      capacityThreshold,
      crowdLevel: classifyCrowd(activeVisitors, capacityThreshold),
      updatedAt: new Date().toISOString(),
    });
  }
  await destinations.updateCrowdLevels(new Map([...results].map(([id, c]) => [id, c.crowdLevel])));
  await Promise.all([...results].map(([id, crowd]) => getCache().set(cacheKeys.crowd(id), crowd, cacheTtl())));
  return results;
}

// FR-03.06 / FR-03.07 - aggregated crowd information only (no individual locations)
export async function getCrowd(destinationIds) {
  const result = new Map();
  const missing = [];
  for (const id of destinationIds) {
    const cached = await getCache().get(cacheKeys.crowd(id));
    if (cached) result.set(id, cached);
    else missing.push(id);
  }
  if (missing.length > 0) {
    const fresh = await recalculate(missing.length === 1 ? missing[0] : null);
    for (const id of missing) if (fresh.has(id)) result.set(id, fresh.get(id));
  }
  return result;
}

function parseCoordinates(body) {
  const { latitude, longitude } = body || {};
  // Only real numbers count: null or an empty string must not be read as the point (0, 0)
  const valid =
    Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  if (!valid) throw new HttpError(400, 'A valid current location (latitude and longitude) is required to check in.');
  return { latitude, longitude };
}

// UC-06 Check In at Destination (Expanded Use Case Table 43, SSD Fig. 25)
export async function checkIn(userId, destinationId, body) {
  const user = await users.findById(userId);
  if (!user.locationConsent) {
    // Pre-condition of UC-06 / FR-01.07
    throw new HttpError(403, 'Check-in uses your location. Please give location consent in your profile first.');
  }

  const destination = await destinations.findActiveById(destinationId);
  if (!destination) throw new HttpError(404, 'Destination not found.');

  const { latitude, longitude } = parseCoordinates(body);

  // Step 3: verify the tourist is within the destination area (alternative flow 3a)
  const area = await destinations.distanceToDestination(destinationId, latitude, longitude);
  if (!area.inside) {
    const km = (area.distanceM / 1000).toFixed(1);
    const radiusKm = (area.areaRadiusM / 1000).toFixed(1);
    throw new HttpError(
      422,
      `Check-in rejected: you are about ${km} km from ${destination.name}. You must be within ${radiusKm} km of the destination area.`,
    );
  }

  const previous = await checkins.findActiveByUser(userId);
  if (previous && previous.destinationId === destinationId) {
    throw new HttpError(409, `You are already checked in at ${destination.name}.`);
  }

  // Step 4: record the check-in. A tourist can only be at one destination at a time,
  // so an earlier active check-in elsewhere is closed and its visit recorded.
  let checkIn;
  try {
    checkIn = await withTransaction(async (client) => {
      if (previous) await checkins.closeAndRecordVisit(client, previous.checkinId, 'auto_closed');
      return checkins.insertActive(client, userId, destinationId);
    });
  } catch (err) {
    // Two requests from the same tourist at the same moment: the database allows one active check-in
    if (err.code === '23505') throw new HttpError(409, 'Your check-in is already being recorded.');
    throw err;
  }

  // Step 5: update the active visitor count and crowd level
  const crowd = (await recalculate(destinationId)).get(destinationId);
  if (previous) await recalculate(previous.destinationId);

  return {
    message: `You are checked in at ${destination.name}. Thank you for helping keep crowd levels accurate.`,
    checkIn,
    crowd,
    closedPrevious: previous ? { destinationId: previous.destinationId, destinationName: previous.destinationName } : null,
  };
}

export function getActiveCheckIn(userId) {
  return checkins.findActiveByUser(userId);
}

// FR-03.02 - close check-ins automatically after the configured time, then refresh crowd levels.
// The same cycle renews the weather before it turns stale, so a tourist's request rarely waits for
// OpenWeatherMap (SRS 3.3.2), and removes logged-out sessions and failed sign-ins that have expired.
export async function runRefreshCycle() {
  const expired = await checkins.listExpiredActive(config.checkinAutoCloseHours);
  for (const { checkin_id: checkinId } of expired) {
    await withTransaction((client) => checkins.closeAndRecordVisit(client, checkinId, 'auto_closed'));
  }
  await recalculate();
  await refreshWeatherAhead(await destinations.listActive(''));
  await sessions.deleteExpired(config.loginLockMinutes);
  return { autoClosed: expired.length };
}

export function startRefreshJob() {
  const tick = () =>
    runRefreshCycle()
      .then(({ autoClosed }) => autoClosed && console.log(`[crowd] Auto-closed ${autoClosed} expired check-in(s).`))
      .catch((err) => console.error('[crowd] Refresh cycle failed:', err.message));
  tick();
  return setInterval(tick, config.crowdRefreshSeconds * 1000);
}
