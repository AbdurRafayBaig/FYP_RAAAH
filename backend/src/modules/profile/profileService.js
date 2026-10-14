import { withTransaction } from '../../data/db.js';
import * as users from '../../data/repositories/userRepository.js';
import { INTERESTS } from '../../domain.js';
import { HttpError } from '../../middleware/errors.js';
import { NAME_RULE, isValidEmail, isValidFullName, normaliseEmail, normaliseName } from '../auth/authService.js';

// UC-03 Manage Profile and Preferences (Expanded Use Case Table 40, SSD Fig. 22)

export function getProfile(userId) {
  return users.findById(userId);
}

function validate(body) {
  const fields = {};

  const fullName = normaliseName(body.fullName);
  if (!isValidFullName(fullName)) fields.fullName = NAME_RULE;

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
