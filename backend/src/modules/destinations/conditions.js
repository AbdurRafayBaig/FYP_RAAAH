// FR-05.01 / FR-05.02 - analysis of a destination's current conditions.
// Used for the warning on the destination page (UC-04 alt 6a) and to decide
// whether alternatives are needed (UC-09).

export function assessConditions({ crowdLevel, riskStatus, weather, accessInfo, hazards = [] }) {
  const reasons = [];

  const crowded = crowdLevel === 'High' || crowdLevel === 'Critical';
  if (crowded) reasons.push(`Crowd level is ${crowdLevel}.`);

  const unsafe = riskStatus !== 'Low Risk' || hazards.length > 0;
  if (riskStatus !== 'Low Risk') reasons.push(`Safety status is ${riskStatus}.`);
  if (hazards.length > 0) {
    const types = [...new Set(hazards.map((h) => h.hazardType))].join(', ');
    reasons.push(`${hazards.length} verified hazard ${hazards.length === 1 ? 'report' : 'reports'}: ${types}.`);
  }

  const accessStatus = accessInfo?.status || 'Open';
  const inaccessible = accessStatus === 'Closed';
  if (inaccessible) reasons.push('Access to the destination is currently closed.');
  else if (accessStatus === 'Limited') reasons.push('Access to the destination is limited.');

  const unfavourableWeather = weather?.unfavourable === true;
  if (unfavourableWeather) reasons.push(`Unfavourable weather: ${weather.description || weather.condition}.`);

  return {
    crowded,
    unsafe,
    inaccessible,
    unfavourableWeather,
    needsAlternatives: crowded || unsafe || inaccessible || unfavourableWeather,
    reasons,
  };
}

// FR-05.01 - compare a destination with the tourist's travel preferences
export function matchPreferences(userInterests = [], destinationInterests = []) {
  return destinationInterests.filter((i) => userInterests.includes(i));
}
