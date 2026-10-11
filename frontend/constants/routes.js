// ================================
// APPLICATION ROUTES
// ================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: (id) => `/destinations/${id}`,
  RECOMMENDATIONS: '/recommendations',
  SAFETY: '/safety',
  CULTURE: '/culture',
  ABOUT_US: '/about',
  REPORT_HAZARD: '/report-hazard',
  ANALYTICS_DASHBOARD: '/analytics-dashboard',
};
