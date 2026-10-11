import { withTransaction } from '../../data/db.js';
import * as users from '../../data/repositories/userRepository.js';
import { INTERESTS } from '../../domain.js';
import { HttpError } from '../../middleware/errors.js';
import { isValidEmail, normaliseEmail } from '../auth/authService.js';

// UC-03 Manage Profile and Preferences (Expanded Use Case Table 40, SSD Fig. 22)

const NAME_PATTERN = /^[\p{L}][\p{L} .'-]{1,99}$/u;

export function getProfile(userId) {
  return users.findById(userId);
}

function validate(body) {
  const fields = {};

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim().replace(/\s+/g, ' ') : '';
  if (!NAME_PATTERN.test(fullName)) {
    fields.fullName = 'Enter your full name (2-100 letters; spaces, dots, apostrophes and hyphens allowed).';
  }

  const email = normaliseEmail(body.email);
  if (!isValidEmail(email)) fields.email = 'Enter a valid email address.';

  const interests = Array.isArray(body.interests) ? [...new Set(body.interests)] : null;
  if (!interests || interests.some((i) => !INTERESTS.includes(i))) {
    fields.interests = `Choose travel preferences from: ${INTERESTS.join(', ')}.`;
  }

  if (typeof body.locationConsent !== 'boolean') {
    fields.locationConsent = 'Location consent must be either given or withdrawn.';
  }

  return { fields, value: { fullName, email, interests, locationConsent: body.locationConsent } };
}

// Steps 3-5; alt 4a keeps the previous values (the transaction is rolled back)
export async function updateProfile(userId, body = {}) {
  const { fields, value } = validate(body);
  if (Object.keys(fields).length === 0 && (await users.emailExists(value.email, userId))) {
    fields.email = 'This email is already used by another account.';
  }
  if (Object.keys(fields).length > 0) {
    throw new HttpError(400, 'Some information is invalid. Your previous values have been kept.', fields);
  }

  await withTransaction(async (client) => {
    await users.updateProfile(client, userId, value);
    await users.replaceInterests(client, userId, value.interests);
  });
  return users.findById(userId);
}
