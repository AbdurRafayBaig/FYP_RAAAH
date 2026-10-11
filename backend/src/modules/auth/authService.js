import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { getCache, cacheKeys } from '../../data/cache.js';
import * as users from '../../data/repositories/userRepository.js';
import { HttpError } from '../../middleware/errors.js';

// Authentication and Profile Service (Component Diagram, Fig. 37) - UC-02 Login

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email) && email.length <= 255;
}

// Used to keep response time constant when the email is unknown
const DUMMY_HASH = bcrypt.hashSync('raaah-timing-guard', 10);

// UC-02 step 4: verify credentials and identify the user's role
export async function login({ email, password }) {
  const normalised = normaliseEmail(email);
  if (!isValidEmail(normalised) || typeof password !== 'string' || password.length === 0) {
    throw new HttpError(400, 'Please enter your email and password.');
  }

  const credentials = await users.findCredentialsByEmail(normalised);
  const passwordOk = await bcrypt.compare(password, credentials?.password_hash || DUMMY_HASH);
  if (!credentials || !passwordOk) {
    // UC-02 alt 4a
    throw new HttpError(401, 'Invalid email or password. Please try again.');
  }

  const user = await users.findById(credentials.user_id);
  const token = jwt.sign({ role: user.role }, config.jwtSecret, {
    subject: String(user.userId),
    expiresIn: config.jwtExpiresIn,
    jwtid: crypto.randomUUID(),
  });
  return { token, user };
}

// FR-01.03 - log out: the token is revoked until it would have expired
export async function logout({ jti, exp }) {
  const ttl = Math.max(1, exp - Math.floor(Date.now() / 1000));
  await getCache().set(cacheKeys.revokedToken(jti), true, ttl);
}

export async function currentUser(userId) {
  const user = await users.findById(userId);
  if (!user) throw new HttpError(401, 'Your account no longer exists.');
  return user;
}
