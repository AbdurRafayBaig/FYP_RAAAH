import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { getCache, cacheKeys } from '../../data/cache.js';
import { withTransaction } from '../../data/db.js';
import * as users from '../../data/repositories/userRepository.js';
import { INTERESTS } from '../../domain.js';
import { HttpError } from '../../middleware/errors.js';

// Authentication and Profile Service (Component Diagram, Fig. 37) - UC-01 Register, UC-02 Login

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}][\p{L} .'-]{1,99}$/u;

export function normaliseEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email) && email.length <= 255;
}

export function normaliseName(name) {
  return typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
}

export function isValidFullName(name) {
  return NAME_PATTERN.test(name);
}

export const NAME_RULE = 'Enter your full name (2-100 letters; spaces, dots, apostrophes and hyphens allowed).';

// Used to keep response time constant when the email is unknown
const DUMMY_HASH = bcrypt.hashSync('raaah-timing-guard', 10);

function issueToken(user) {
  return jwt.sign({ role: user.role }, config.jwtSecret, {
    subject: String(user.userId),
    expiresIn: config.jwtExpiresIn,
    jwtid: crypto.randomUUID(),
  });
}

// FR-01.02 - unique Tourist ID, derived from the account number and year of registration
export const touristCodeFor = (userId, createdAt) =>
  `RAH-${new Date(createdAt).getFullYear()}-${String(userId).padStart(6, '0')}`;

// bcrypt only uses the first 72 bytes of a password
const MAX_PASSWORD_BYTES = 72;

function validateRegistration(body) {
  const fields = {};

  const fullName = normaliseName(body.fullName);
  if (!isValidFullName(fullName)) fields.fullName = NAME_RULE;

  const email = normaliseEmail(body.email);
  if (!isValidEmail(email)) fields.email = 'Enter a valid email address.';

  const { password, confirmPassword } = body;
  if (typeof password !== 'string' || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    fields.password = 'Use at least 8 characters, with at least one letter and one number.';
  } else if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
    fields.password = 'Use at most 72 characters.';
  } else if (confirmPassword !== password) {
    fields.confirmPassword = 'The two passwords do not match.';
  }

  const interests = Array.isArray(body.interests) ? [...new Set(body.interests)] : [];
  if (interests.length === 0 || interests.some((i) => !INTERESTS.includes(i))) {
    fields.interests = 'Choose at least one travel preference.';
  }

  return { fields, value: { fullName, email, password, interests } };
}

const ALREADY_REGISTERED = 'This email is already registered. Please sign in instead.';

// UC-01 Register Account (Expanded Use Case Table 38, SSD Fig. 20)
export async function register(body = {}) {
  // Step 4: validate the information; alt 4b highlights the fields to correct
  const { fields, value } = validateRegistration(body);
  if (Object.keys(fields).length > 0) {
    throw new HttpError(400, 'Please correct the highlighted fields.', fields);
  }
  // Alt 4a: email already registered
  if (await users.emailExists(value.email)) {
    throw new HttpError(409, ALREADY_REGISTERED, { email: ALREADY_REGISTERED });
  }

  // Step 5: create the account and generate the Tourist ID
  const passwordHash = await bcrypt.hash(value.password, 10);
  let userId;
  try {
    userId = await withTransaction(async (client) => {
      const created = await users.insertTourist(client, { ...value, passwordHash });
      await users.setTouristCode(client, created.user_id, touristCodeFor(created.user_id, created.created_at));
      await users.replaceInterests(client, created.user_id, value.interests);
      return created.user_id;
    });
  } catch (err) {
    // Two registrations with the same email at the same moment
    if (err.code === '23505') throw new HttpError(409, ALREADY_REGISTERED, { email: ALREADY_REGISTERED });
    throw err;
  }

  // The new tourist is signed in straight away
  const user = await users.findById(userId);
  return {
    token: issueToken(user),
    user,
    // Step 6: confirmation message
    message: `Your account has been created. Your Tourist ID is ${user.touristCode}.`,
  };
}

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
  return { token: issueToken(user), user };
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
