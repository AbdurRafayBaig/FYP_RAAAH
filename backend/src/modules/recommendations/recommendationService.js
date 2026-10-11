import * as users from '../../data/repositories/userRepository.js';
import * as visits from '../../data/repositories/visitRepository.js';
import * as destinationRepo from '../../data/repositories/destinationRepository.js';
import * as recommendationRepo from '../../data/repositories/recommendationRepository.js';
import * as aiEngine from '../../integrations/aiEngineClient.js';
import { listDestinations } from '../destinations/destinationService.js';
import { assessConditions, matchPreferences } from '../destinations/conditions.js';
import { HttpError } from '../../middleware/errors.js';

// Recommendation Service (Component Diagram, Fig. 37)
// UC-09 Get Alternative Destination Recommendations (Expanded Use Case Table 46, SSD Fig. 28)
// DFD Level 2 - Alternative Destination Recommendation (Fig. 42)

const MAX_RECOMMENDATIONS = 5;

function parseOptionalLocation(body) {
  const { latitude, longitude } = body;
  if (latitude == null && longitude == null) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new HttpError(400, 'The location provided is not valid.');
  }
  return { latitude, longitude };
}

function parseSourceId(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Selected destination not found.');
  return id;
}

export async function recommend(userId, body = {}) {
  // 4.1 Receive tourist request
  const sourceDestinationId = parseSourceId(body.sourceDestinationId);
  const requestedLocation = parseOptionalLocation(body);

  // 4.2 Collect tourist and destination data (step 2: preferences, visit history and location)
  const [user, visitCounts, destinations] = await Promise.all([
    users.findById(userId),
    visits.visitCountsByDestination(userId),
    listDestinations(''),
  ]);
  // FR-01.07 - location is only used with the tourist's consent
  const location = user.locationConsent ? requestedLocation : null;

  let source = null;
  if (sourceDestinationId !== null) {
    source = destinations.find((d) => d.destinationId === sourceDestinationId);
    if (!source) throw new HttpError(404, 'Selected destination not found.');
    const hazards = await destinationRepo.listVerifiedHazards(sourceDestinationId);
    source = {
      ...source,
      hazards,
      advisory: assessConditions({
        crowdLevel: source.crowd.crowdLevel,
        riskStatus: source.riskStatus,
        weather: source.weather,
        accessInfo: source.accessInfo,
        hazards,
      }),
      preferenceMatch: matchPreferences(user.interests, source.interests),
    };
  }

  // Steps 3-5: current crowd, safety, weather and accessibility data -> AI engine scores and ranks
  const engineResult = await aiEngine.scoreDestinations({
    tourist: {
      interests: user.interests,
      visitCounts,
      location: location && { latitude: location.latitude, longitude: location.longitude },
    },
    sourceDestinationId,
    limit: MAX_RECOMMENDATIONS,
    destinations: destinations.map((d) => ({
      destinationId: d.destinationId,
      name: d.name,
      interests: d.interests,
      latitude: d.location.latitude,
      longitude: d.location.longitude,
      crowdLevel: d.crowd.crowdLevel,
      riskStatus: d.riskStatus,
      accessStatus: d.accessInfo.status,
      weatherUnfavourable: d.weather ? d.weather.unfavourable : null,
      accommodationAvailable: d.accommodationAvailable,
    })),
  });

  const byId = new Map(destinations.map((d) => [d.destinationId, d]));
  const ranked = engineResult.recommendations.filter((r) => byId.has(r.destinationId));

  // 4.5 Rank and present recommendations -> D7 Recommendations
  await recommendationRepo.saveRanked(userId, sourceDestinationId, ranked);

  const noSuitableAlternative = ranked.length === 0;
  return {
    source,
    recommendations: ranked.map((r) => ({
      rank: r.rank,
      score: r.score,
      reasons: r.reasons,
      factors: r.factors,
      previouslyVisited: r.previouslyVisited,
      destination: byId.get(r.destinationId),
    })),
    noSuitableAlternative,
    // UC-09 alt 6a
    message: noSuitableAlternative
      ? 'No suitable alternative destination was found right now. Please review the safety information of your selected destination before travelling.'
      : undefined,
    usedLocation: Boolean(location),
    engine: engineResult.engine,
  };
}
