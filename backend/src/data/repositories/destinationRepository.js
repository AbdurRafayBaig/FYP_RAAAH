import { query, hasPostgis } from '../db.js';
import { toCulturalInfo, toDestination, toHazard } from '../models/destination.js';

const DESTINATION_COLUMNS = `
  d.destination_id, d.name, d.description, d.region, d.latitude, d.longitude, d.area_radius_m,
  d.capacity_threshold, d.crowd_level, d.risk_status, d.access_info, d.attractions, d.activities,
  d.accommodation_available, d.image_url, d.gallery, d.altitude_m, d.best_season, d.updated_at,
  COALESCE(
    (SELECT array_agg(i.name ORDER BY i.interest_id)
       FROM destination_interests di JOIN interests i ON i.interest_id = di.interest_id
      WHERE di.destination_id = d.destination_id),
    '{}'
  ) AS interests`;

// FR-02.01 - search and browse registered destinations
export async function listActive(search = '') {
  // % and _ typed by the tourist are searched for as written, not used as wildcards
  const term = search.trim().replace(/[\\%_]/g, '\\$&');
  const { rows } = await query(
    `SELECT ${DESTINATION_COLUMNS}
       FROM destinations d
      WHERE d.is_active
        AND ($1 = '' OR d.name ILIKE '%' || $1 || '%'
                     OR d.region ILIKE '%' || $1 || '%'
                     OR d.description ILIKE '%' || $1 || '%'
                     OR array_to_string(d.attractions, ' ') ILIKE '%' || $1 || '%')
      ORDER BY d.name`,
    [term],
  );
  return rows.map(toDestination);
}

export async function findActiveById(destinationId) {
  const { rows } = await query(
    `SELECT ${DESTINATION_COLUMNS} FROM destinations d WHERE d.destination_id = $1 AND d.is_active`,
    [destinationId],
  );
  return rows[0] ? toDestination(rows[0]) : null;
}

export async function listCapacities() {
  const { rows } = await query(
    'SELECT destination_id, capacity_threshold FROM destinations WHERE is_active',
  );
  return rows;
}

// levels: Map of destination id -> crowd level; one statement for all of them
export async function updateCrowdLevels(levels) {
  if (levels.size === 0) return;
  await query(
    `UPDATE destinations d SET crowd_level = v.level, updated_at = NOW()
       FROM unnest($1::int[], $2::text[]) AS v(id, level)
      WHERE d.destination_id = v.id AND d.crowd_level <> v.level`,
    [[...levels.keys()], [...levels.values()]],
  );
}

// FR-03.01 - is the tourist inside the destination area?
// Returns the distance in metres together with the decision; the tourist's
// coordinates are only used for this check and are never stored (SRS 3.3.4).
export async function distanceToDestination(destinationId, latitude, longitude) {
  const sql = (await hasPostgis())
    ? `SELECT area_radius_m,
              ST_Distance(ST_MakePoint(longitude, latitude)::geography,
                          ST_MakePoint($3, $2)::geography) AS distance_m
         FROM destinations WHERE destination_id = $1`
    : `SELECT area_radius_m,
              2 * 6371000 * asin(sqrt(
                power(sin(radians($2 - latitude) / 2), 2) +
                cos(radians(latitude)) * cos(radians($2)) * power(sin(radians($3 - longitude) / 2), 2)
              )) AS distance_m
         FROM destinations WHERE destination_id = $1`;
  const { rows } = await query(sql, [destinationId, latitude, longitude]);
  if (!rows[0]) return null;
  const distanceM = Number(rows[0].distance_m);
  return { distanceM, areaRadiusM: rows[0].area_radius_m, inside: distanceM <= rows[0].area_radius_m };
}

// FR-02.04 - cultural or historical background
export async function listCulturalInfo(destinationId) {
  const { rows } = await query(
    `SELECT info_id, category, title, content FROM cultural_info
      WHERE destination_id = $1 ORDER BY category, info_id`,
    [destinationId],
  );
  return rows.map(toCulturalInfo);
}

// FR-06.03 / FR-07.04 - only Verified reports affect public safety information
export async function listVerifiedHazards(destinationId) {
  const { rows } = await query(
    `SELECT report_id, hazard_type, location, description, created_at
       FROM hazard_reports
      WHERE destination_id = $1 AND status = 'Verified'
      ORDER BY created_at DESC`,
    [destinationId],
  );
  return rows.map(toHazard);
}
