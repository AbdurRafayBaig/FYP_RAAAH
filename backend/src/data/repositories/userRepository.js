import { query } from '../db.js';
import { toUser } from '../models/user.js';

const USER_COLUMNS = `
  u.user_id, u.full_name, u.email, u.role, u.tourist_code, u.location_consent, u.created_at,
  COALESCE(
    (SELECT array_agg(i.name ORDER BY i.interest_id)
       FROM user_interests ui JOIN interests i ON i.interest_id = ui.interest_id
      WHERE ui.user_id = u.user_id),
    '{}'
  ) AS interests`;

export async function findById(userId, db = { query }) {
  const { rows } = await db.query(`SELECT ${USER_COLUMNS} FROM users u WHERE u.user_id = $1`, [userId]);
  return toUser(rows[0]);
}

export async function findCredentialsByEmail(email) {
  const { rows } = await query(
    'SELECT user_id, password_hash FROM users WHERE email = $1',
    [email],
  );
  return rows[0] || null;
}

export async function emailExists(email, exceptUserId = null, db = { query }) {
  const { rows } = await db.query(
    'SELECT 1 FROM users WHERE email = $1 AND ($2::int IS NULL OR user_id <> $2)',
    [email, exceptUserId],
  );
  return rows.length > 0;
}

export async function insertTourist(client, { fullName, email, passwordHash }) {
  const { rows } = await client.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'tourist')
     RETURNING user_id, created_at`,
    [fullName, email, passwordHash],
  );
  return rows[0];
}

export async function setTouristCode(client, userId, touristCode) {
  await client.query('UPDATE users SET tourist_code = $2 WHERE user_id = $1', [userId, touristCode]);
}

export async function updateProfile(client, userId, { fullName, email, locationConsent }) {
  await client.query(
    'UPDATE users SET full_name = $2, email = $3, location_consent = $4 WHERE user_id = $1',
    [userId, fullName, email, locationConsent],
  );
}

export async function replaceInterests(client, userId, interestNames) {
  await client.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);
  if (interestNames.length === 0) return;
  await client.query(
    `INSERT INTO user_interests (user_id, interest_id)
     SELECT $1, interest_id FROM interests WHERE name = ANY($2::text[])`,
    [userId, interestNames],
  );
}

export async function listInterestOptions() {
  const { rows } = await query('SELECT name FROM interests ORDER BY interest_id');
  return rows.map((r) => r.name);
}
