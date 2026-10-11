import { query } from '../db.js';
import { toCheckIn } from '../models/checkIn.js';

export async function findActiveByUser(userId, db = { query }) {
  const { rows } = await db.query(
    `SELECT c.*, d.name AS destination_name
       FROM check_ins c JOIN destinations d ON d.destination_id = c.destination_id
      WHERE c.user_id = $1 AND c.status = 'active'`,
    [userId],
  );
  return toCheckIn(rows[0]);
}

export async function insertActive(client, userId, destinationId) {
  const { rows } = await client.query(
    `INSERT INTO check_ins (user_id, destination_id) VALUES ($1, $2)
     RETURNING *, (SELECT name FROM destinations WHERE destination_id = $2) AS destination_name`,
    [userId, destinationId],
  );
  return toCheckIn(rows[0]);
}

// Closes a check-in and records the completed visit (FR-04.01).
export async function closeAndRecordVisit(client, checkinId, status) {
  const { rows } = await client.query(
    `UPDATE check_ins SET status = $2, checkout_time = NOW()
      WHERE checkin_id = $1 AND status = 'active'
      RETURNING user_id, destination_id, checkin_time, checkout_time`,
    [checkinId, status],
  );
  const closed = rows[0];
  if (!closed) return null;
  // $3 must stay a timestamp: typed as a date it would count the stay from midnight
  await client.query(
    `INSERT INTO visits (user_id, destination_id, visit_date, duration_min)
     VALUES ($1, $2, ($3::timestamptz)::date, GREATEST(0, EXTRACT(EPOCH FROM ($4::timestamptz - $3::timestamptz)) / 60)::int)`,
    [closed.user_id, closed.destination_id, closed.checkin_time, closed.checkout_time],
  );
  return closed;
}

// FR-03.02 - check-ins that passed the configured time
export async function listExpiredActive(autoCloseHours) {
  const { rows } = await query(
    `SELECT checkin_id, destination_id FROM check_ins
      WHERE status = 'active' AND checkin_time < NOW() - make_interval(hours => $1)`,
    [autoCloseHours],
  );
  return rows;
}

// FR-03.04 - active visitor count per destination
export async function countActiveByDestination(destinationId = null) {
  const { rows } = await query(
    `SELECT destination_id, COUNT(*)::int AS active_visitors
       FROM check_ins
      WHERE status = 'active' AND ($1::int IS NULL OR destination_id = $1)
      GROUP BY destination_id`,
    [destinationId],
  );
  return new Map(rows.map((r) => [r.destination_id, r.active_visitors]));
}
