import { query } from '../db.js';

// FR-01.03 log out and SRS 3.3.3 sign-in protection: logged-out sessions and failed sign-ins

export async function revokeToken(jti, expiresAtSeconds) {
  await query(
    `INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, to_timestamp($2))
     ON CONFLICT (jti) DO NOTHING`,
    [jti, expiresAtSeconds],
  );
}

export async function isTokenRevoked(jti) {
  const { rows } = await query('SELECT 1 FROM revoked_tokens WHERE jti = $1', [jti]);
  return rows.length > 0;
}

// Failed sign-ins within the last `minutes`, and when the oldest of them happened
export async function recentLoginFailures(email, ipAddress, minutes) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS failures, MIN(failed_at) AS oldest
       FROM login_failures
      WHERE email = $1 AND ip_address = $2 AND failed_at > NOW() - make_interval(mins => $3)`,
    [email, ipAddress, minutes],
  );
  return { failures: rows[0].failures, oldest: rows[0].oldest };
}

export async function recordLoginFailure(email, ipAddress) {
  await query('INSERT INTO login_failures (email, ip_address) VALUES ($1, $2)', [email, ipAddress]);
}

export async function clearLoginFailures(email, ipAddress) {
  await query('DELETE FROM login_failures WHERE email = $1 AND ip_address = $2', [email, ipAddress]);
}

// Removes rows that no longer matter: expired sessions and failures older than the lock period
export async function deleteExpired(lockMinutes) {
  await query('DELETE FROM revoked_tokens WHERE expires_at < NOW()');
  await query('DELETE FROM login_failures WHERE failed_at < NOW() - make_interval(mins => $1)', [lockMinutes]);
}
