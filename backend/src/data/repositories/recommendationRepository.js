import { query } from '../db.js';

// DFD Level 2 (Fig. 42), process 4.5 -> data store D7 Recommendations
export async function saveRanked(userId, sourceDestinationId, ranked) {
  if (ranked.length === 0) return;
  await query(
    `INSERT INTO recommendations (user_id, source_destination_id, recommended_destination_id, score, rank_position)
     SELECT $1, $2, r.destination_id, r.score, r.rank_position
       FROM unnest($3::int[], $4::numeric[], $5::int[]) AS r(destination_id, score, rank_position)`,
    [
      userId,
      sourceDestinationId,
      ranked.map((r) => r.destinationId),
      ranked.map((r) => r.score),
      ranked.map((r) => r.rank),
    ],
  );
}
