import { query } from '../db.js';

// password_resets (ERD extension, SRS 3.3.3) - tokens are stored as SHA-256 hashes only

export async function countRecent(userId, minutes) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS n FROM password_resets
      WHERE user_id = $1 AND created_at > NOW() - make_interval(mins => $2)`,
    [userId, minutes],
  );
  return rows[0].n;
}

// A new link replaces any earlier unused one
export async function create(userId, tokenHash, validMinutes) {
  await query('UPDATE password_resets SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [userId]);
  await query(
    `INSERT INTO password_resets (token_hash, user_id, expires_at)
     VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
    [tokenHash, userId, validMinutes],
  );
}

// Marks the token used and returns its user, in one statement so a token can be used only once
export async function consume(client, tokenHash) {
  const { rows } = await client.query(
    `UPDATE password_resets SET used_at = NOW()
      WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
      RETURNING user_id`,
    [tokenHash],
  );
  return rows[0]?.user_id ?? null;
}
