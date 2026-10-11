// ================================
// USER ROLES (SRS FR-01.03, Table 20)
// ================================

import { ROUTES } from './routes';

export const ROLES = {
  TOURIST: 'tourist',
  OBSERVER: 'community_safety_observer',
  ADMIN: 'administrator',
  AUTHORITY: 'tourism_authority',
};

export const ROLE_LABELS = {
  [ROLES.TOURIST]: 'Tourist',
  [ROLES.OBSERVER]: 'Community Safety Observer',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.AUTHORITY]: 'Tourism Authority',
};

// A Community Safety Observer can also perform all Tourist use cases
export const TOURIST_ROLES = [ROLES.TOURIST, ROLES.OBSERVER];
export const DASHBOARD_ROLES = [ROLES.ADMIN, ROLES.AUTHORITY];

export const isTouristRole = (role) => TOURIST_ROLES.includes(role);

// UC-02 step 5: home page or dashboard according to the role
export function homePathForRole(role) {
  return DASHBOARD_ROLES.includes(role) ? ROUTES.ANALYTICS_DASHBOARD : ROUTES.HOME;
}
