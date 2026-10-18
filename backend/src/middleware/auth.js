import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getCache, getCacheKind, cacheKeys } from '../data/cache.js';
import { isTokenRevoked } from '../data/repositories/sessionRepository.js';
import { HttpError } from './errors.js';

// Role-based access is enforced on the server for every request (SRS 3.3.3).

// FR-01.03 - the cache answers most checks. Without a shared Redis cache every server instance has
// its own memory, so the database decides whether another instance recorded the logout.
async function isRevoked(jti) {
  if (await getCache().get(cacheKeys.revokedToken(jti))) return true;
  if (getCacheKind() === 'redis') return false;
  return isTokenRevoked(jti);
}

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please log in to continue.');

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new HttpError(401, 'Your session has expired. Please log in again.');
  }
  if (await isRevoked(payload.jti)) {
    throw new HttpError(401, 'You have logged out. Please log in again.');
  }

  req.auth = { userId: Number(payload.sub), role: payload.role, jti: payload.jti, exp: payload.exp };
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth?.role)) {
      throw new HttpError(403, 'You do not have access to this feature.');
    }
    next();
  };
}
