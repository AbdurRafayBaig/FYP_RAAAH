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
  MY_TRIPS: '/my-trips',
  ACCOMMODATIONS: '/accommodations',
  CULTURE: '/culture',
  ABOUT_US: '/about',
  REPORT_HAZARD: '/report-hazard',

  // Admin & Authority Portals
  ADMIN_DASHBOARD: '/business-portal',
  ANALYTICS_DASHBOARD: '/analytics-dashboard',
};

// Simplified navigation links for tourist navbar (Section 45)
export const TOURIST_NAV_LINKS = [
  { label: 'Explore', href: ROUTES.HOME },
  { label: 'Destinations', href: ROUTES.DESTINATIONS },
  { label: 'Safety', href: ROUTES.SAFETY },
  { label: 'About', href: ROUTES.ABOUT_US },
];

