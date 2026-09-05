// ================================
// APPLICATION ROUTES
// Centralized route definitions for navigation
// ================================

export const ROUTES = {
  // Tourist Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: (id) => `/destinations/${id}`,
  CROWD_MAP: '/crowd-map',
  SAFETY: '/safety',
  ACCOMMODATIONS: '/accommodations',
  CULTURE: '/culture',
  ABOUT_US: '/about',
  REPORT_HAZARD: '/report-hazard',

  // Admin & Authority Portals
  ADMIN_DASHBOARD: '/business-portal',
  ANALYTICS_DASHBOARD: '/analytics-dashboard',
};

// Navigation links for tourist navbar
export const TOURIST_NAV_LINKS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Destinations', href: ROUTES.DESTINATIONS },
  { label: 'Live Crowd Map', href: ROUTES.CROWD_MAP },
  { label: 'Safety & Alerts', href: ROUTES.SAFETY },
  { label: 'Accommodations', href: ROUTES.ACCOMMODATIONS },
  { label: 'Culture', href: ROUTES.CULTURE },
  { label: 'About Us', href: ROUTES.ABOUT_US },
];
