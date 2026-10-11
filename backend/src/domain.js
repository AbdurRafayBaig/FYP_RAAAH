// ==========================================
// RAAAH domain constants (SRS Section 3)
// ==========================================

// FR-01.03 - user roles
export const ROLES = {
  TOURIST: 'tourist',
  OBSERVER: 'community_safety_observer',
  ADMIN: 'administrator',
  AUTHORITY: 'tourism_authority',
};

// A Community Safety Observer can also perform all Tourist use cases (SRS Table 20).
export const TOURIST_ROLES = [ROLES.TOURIST, ROLES.OBSERVER];

// FR-01.04 - travel preferences
export const INTERESTS = ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography'];

// FR-03.05 / Table 11 - crowd level classification
export const CROWD_LEVELS = ['Low', 'Moderate', 'High', 'Critical'];

// Each destination has one configurable capacity threshold (FR-03.03).
// ratio = active visitors / capacity threshold
//   Low       ratio <  0.60                       within the normal capacity range
//   Moderate  0.60 <= ratio < 1.00                approaching the configured capacity
//   High      1.00 <= ratio <= CAPACITY_LIMIT     reached the configured threshold
//   Critical  ratio >  CAPACITY_LIMIT             exceeded the capacity limit
export const CROWD_BANDS = {
  MODERATE_FROM: 0.6,
  HIGH_FROM: 1.0,
  CAPACITY_LIMIT: 1.2,
};

export function classifyCrowd(activeVisitors, capacityThreshold) {
  const ratio = capacityThreshold > 0 ? activeVisitors / capacityThreshold : 0;
  if (ratio > CROWD_BANDS.CAPACITY_LIMIT) return 'Critical';
  if (ratio >= CROWD_BANDS.HIGH_FROM) return 'High';
  if (ratio >= CROWD_BANDS.MODERATE_FROM) return 'Moderate';
  return 'Low';
}

// FR-06.01 - destination risk status
export const RISK_STATUSES = ['Low Risk', 'Elevated Risk', 'High Risk'];

// FR-06.02 - supported hazard types
export const HAZARD_TYPES = [
  'Flash Flood',
  'Landslide',
  'Rockfall',
  'Glacier-related Hazard',
  'Road Blockage',
  'Extreme Weather',
];

// FR-07.02 / FR-07.03 - hazard report workflow
export const HAZARD_STATUSES = ['Unverified', 'Under Review', 'Verified', 'Resolved', 'Rejected'];

// Destination accessibility (stored in destinations.access_info)
export const ACCESS_STATUSES = ['Open', 'Limited', 'Closed'];
