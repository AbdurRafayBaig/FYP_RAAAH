import { query } from '../db.js';

// saved_destinations (ERD, Fig. 44) - UC-05 Save Destination

// Returns false when the destination was already saved (UC-05 alt 3a)
export async function save(userId, destinationId) {
  const { rowCount } = await query(
    `INSERT INTO saved_destinations (user_id, destination_id) VALUES ($1, $2)
     ON CONFLICT (user_id, destination_id) DO NOTHING`,
    [userId, destinationId],
  );
  return rowCount === 1;
}

export async function remove(userId, destinationId) {
  const { rowCount } = await query(
    'DELETE FROM saved_destinations WHERE user_id = $1 AND destination_id = $2',
    [userId, destinationId],
  );
  return rowCount === 1;
}

export async function isSaved(userId, destinationId) {
  const { rows } = await query(
    'SELECT 1 FROM saved_destinations WHERE user_id = $1 AND destination_id = $2',
    [userId, destinationId],
  );
  return rows.length > 0;
}

// Active destinations only, most recently saved first
export async function listIds(userId) {
  const { rows } = await query(
    `SELECT s.destination_id, s.saved_at
       FROM saved_destinations s JOIN destinations d ON d.destination_id = s.destination_id
      WHERE s.user_id = $1 AND d.is_active
      ORDER BY s.saved_at DESC`,
    [userId],
  );
  return rows.map((r) => ({ destinationId: r.destination_id, savedAt: r.saved_at }));
}
