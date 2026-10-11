import { query } from '../db.js';

// FR-04.03 - visit history supplied to the AI Recommendation Engine
export async function visitCountsByDestination(userId) {
  const { rows } = await query(
    `SELECT destination_id, COUNT(*)::int AS visits
       FROM visits WHERE user_id = $1
      GROUP BY destination_id`,
    [userId],
  );
  return Object.fromEntries(rows.map((r) => [r.destination_id, r.visits]));
}
