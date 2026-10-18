// ==========================================
// API Client (Package Diagram, Presentation Layer)
// Talks to the RAAAH Backend API (Node.js + Express.js)
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'raaah_token';

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable (private mode); the session lasts until reload
  }
}

let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(method, path, body) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the RAAAH server. Please check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && onUnauthorized) onUnauthorized();
    throw new ApiError(res.status, data.error || 'Something went wrong.', data.fields);
  }
  return data;
}

// On the serverless deployment an idle API and AI engine take a few seconds to start. Asking for the
// health check when the site opens starts both, so a tourist's first request does not wait (SRS 3.3.2).
export function warmUp() {
  fetch(`${API_URL}/health`).catch(() => {});
}

export const api = {
  // UC-01 Register Account
  register: (details) => request('POST', '/auth/register', details),

  // UC-02 Login
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  logout: () => request('POST', '/auth/logout'),
  me: () => request('GET', '/auth/me'),

  // UC-03 Manage Profile and Preferences
  getInterests: () => request('GET', '/interests'),
  getProfile: () => request('GET', '/profile'),
  updateProfile: (profile) => request('PUT', '/profile', profile),

  // UC-04 Explore Destinations
  listDestinations: (search = '') =>
    request('GET', `/destinations${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getDestination: (id) => request('GET', `/destinations/${encodeURIComponent(id)}`),

  // UC-06 Check In at Destination
  checkIn: (id, location) => request('POST', `/destinations/${encodeURIComponent(id)}/check-in`, location),

  // UC-09 Get Alternative Destination Recommendations
  getRecommendations: (params) => request('POST', '/recommendations', params),
};
