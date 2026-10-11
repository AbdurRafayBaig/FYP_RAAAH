import { query } from '../db.js';
import { toWeather } from '../models/weather.js';

export async function findByDestinations(destinationIds) {
  const { rows } = await query(
    'SELECT * FROM weather_info WHERE destination_id = ANY($1::int[])',
    [destinationIds],
  );
  return new Map(rows.map((r) => [r.destination_id, toWeather(r)]));
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
