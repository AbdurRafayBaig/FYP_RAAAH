import { query } from '../db.js';
import { toWeather } from '../models/weather.js';

export async function findByDestinations(destinationIds) {
  const { rows } = await query(
    'SELECT * FROM weather_info WHERE destination_id = ANY($1::int[])',
    [destinationIds],
  );
  return new Map(rows.map((r) => [r.destination_id, toWeather(r)]));
}

// Claims the stored weather older than `olderThanSeconds` for renewal. A row claimed in the last
// minute is skipped, so one instance asks the service and a failed call is not repeated at once.
export async function claimForRefresh(destinationIds, olderThanSeconds) {
  const { rows } = await query(
    `UPDATE weather_info SET refresh_claimed_at = NOW()
      WHERE destination_id = ANY($1::int[])
        AND updated_at < NOW() - make_interval(secs => $2)
        AND (refresh_claimed_at IS NULL OR refresh_claimed_at < NOW() - interval '1 minute')
      RETURNING destination_id`,
    [destinationIds, olderThanSeconds],
  );
  return new Set(rows.map((r) => r.destination_id));
}

export async function upsert(destinationId, w) {
  const { rows } = await query(
    `INSERT INTO weather_info (destination_id, temperature, condition, description, weather_code, icon, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (destination_id) DO UPDATE
       SET temperature = EXCLUDED.temperature, condition = EXCLUDED.condition,
           description = EXCLUDED.description, weather_code = EXCLUDED.weather_code,
           icon = EXCLUDED.icon, updated_at = EXCLUDED.updated_at
     RETURNING *`,
    [destinationId, w.temperature, w.condition, w.description, w.weatherCode, w.icon],
  );
  return toWeather(rows[0]);
}
