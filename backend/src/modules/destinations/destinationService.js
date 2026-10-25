import * as destinationRepo from '../../data/repositories/destinationRepository.js';
import * as users from '../../data/repositories/userRepository.js';
import * as savedRepo from '../../data/repositories/savedDestinationRepository.js';
import * as crowdService from '../crowd/crowdService.js';
import { getForecast, getWeather } from './weatherService.js';
import { assessConditions, matchPreferences } from './conditions.js';
import { HttpError } from '../../middleware/errors.js';

// Destination Information Service (Component Diagram, Fig. 37)

function summary(d, crowd, weather) {
  return {
    destinationId: d.destinationId,
    name: d.name,
    region: d.region,
    description: d.description,
    location: d.location,
    imageUrl: d.imageUrl,
    altitudeM: d.altitudeM,
    interests: d.interests,
    riskStatus: d.riskStatus,
    accessInfo: d.accessInfo,
    accommodationAvailable: d.accommodationAvailable,
    crowd: crowd || { crowdLevel: d.crowdLevel, activeVisitors: 0, capacityThreshold: d.capacityThreshold },
    weather,
  };
}

// UC-04 steps 1-2: registered destinations for the list and the map
export async function listDestinations(search = '') {
  const list = await destinationRepo.listActive(search);
  if (list.length === 0) return [];
  const ids = list.map((d) => d.destinationId);
  const [crowd, weather] = await Promise.all([crowdService.getCrowd(ids), getWeather(list)]);
  return list.map((d) => summary(d, crowd.get(d.destinationId), weather.get(d.destinationId)));
}

async function assertActive(destinationId) {
  const d = await destinationRepo.findActiveById(destinationId);
  if (!d) throw new HttpError(404, 'Destination not found.');
  return d;
}

// UC-05 Save Destination (Expanded Use Case Table 42), steps 2-4; alt 3a when it is already saved
export async function saveDestination(userId, destinationId) {
  const d = await assertActive(destinationId);
  const added = await savedRepo.save(userId, destinationId);
  return {
    saved: true,
    alreadySaved: !added,
    message: added
      ? `${d.name} has been added to your saved destinations.`
      : `${d.name} is already in your saved destinations. You can remove it if you no longer need it.`,
  };
}

export async function removeSavedDestination(userId, destinationId) {
  const d = await assertActive(destinationId);
  await savedRepo.remove(userId, destinationId);
  return { saved: false, message: `${d.name} has been removed from your saved destinations.` };
}

// The tourist's saved destinations with their current conditions
export async function listSavedDestinations(userId) {
  const saved = await savedRepo.listIds(userId);
  if (saved.length === 0) return [];
  const all = await listDestinations();
  const byId = new Map(all.map((d) => [d.destinationId, d]));
  return saved.filter((s) => byId.has(s.destinationId)).map((s) => ({ ...byId.get(s.destinationId), savedAt: s.savedAt }));
}

// UC-04 steps 3-6: the destination page
export async function getDestinationPage(destinationId, userId) {
  const d = await destinationRepo.findActiveById(destinationId);
  if (!d) throw new HttpError(404, 'Destination not found.');

  const [crowd, weather, forecast, hazards, culturalInfo, user, activeCheckIn, saved] = await Promise.all([
    crowdService.getCrowd([destinationId]).then((m) => m.get(destinationId)),
    getWeather([d]).then((m) => m.get(destinationId)),
    getForecast(d),
    destinationRepo.listVerifiedHazards(destinationId),
    destinationRepo.listCulturalInfo(destinationId),
    users.findById(userId),
    crowdService.getActiveCheckIn(userId),
    savedRepo.isSaved(userId, destinationId),
  ]);

  const base = summary(d, crowd, weather);
  return {
    ...base,
    attractions: d.attractions,
    activities: d.activities,
    gallery: d.gallery,
    altitudeM: d.altitudeM,
    bestSeason: d.bestSeason,
    areaRadiusM: d.areaRadiusM,
    forecast,
    saved,
    culturalInfo,
    hazards,
    // UC-04 alt 6a - warning and offer of alternative recommendations
    advisory: assessConditions({ crowdLevel: base.crowd.crowdLevel, riskStatus: d.riskStatus, weather, accessInfo: d.accessInfo, hazards }),
    // FR-05.01 - conditions analysed against the tourist's preferences
    preferenceMatch: matchPreferences(user?.interests, d.interests),
    checkInStatus: {
      checkedInHere: activeCheckIn?.destinationId === destinationId,
      activeCheckIn,
      locationConsent: Boolean(user?.locationConsent),
    },
  };
}
