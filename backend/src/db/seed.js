import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../data/db.js';
import { INTERESTS } from '../domain.js';
import { DEMO_PASSWORD, DEMO_USERS, DESTINATIONS, UNVERIFIED_REPORTS } from './seedData.js';

const DEMO_VISITOR_DOMAIN = '@demo-visitor.raaah.pk';

// Synthetic visitors give the demo realistic crowd levels (crowd = active check-ins, FR-03.04).
async function seedDemoCrowd(client) {
  await client.query(
    `DELETE FROM check_ins WHERE user_id IN (SELECT user_id FROM users WHERE email LIKE '%' || $1)`,
    [DEMO_VISITOR_DOMAIN],
  );
  const needed = DESTINATIONS.reduce((sum, d) => sum + d.demoActiveVisitors, 0);
  const unusableHash = await bcrypt.hash(crypto.randomUUID(), 10);
  await client.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     SELECT 'Demo Visitor ' || lpad(n::text, 4, '0'), 'visitor' || lpad(n::text, 4, '0') || $2, $3, 'tourist'
       FROM generate_series(1, $1) AS n
     ON CONFLICT (email) DO NOTHING`,
    [needed, DEMO_VISITOR_DOMAIN, unusableHash],
  );
  const { rows: visitors } = await client.query(
    `SELECT user_id FROM users WHERE email LIKE '%' || $1 ORDER BY email LIMIT $2`,
    [DEMO_VISITOR_DOMAIN, needed],
  );

  let next = 0;
  for (const d of DESTINATIONS) {
    const ids = visitors.slice(next, next + d.demoActiveVisitors).map((v) => v.user_id);
    next += d.demoActiveVisitors;
    await client.query(
      `INSERT INTO check_ins (user_id, destination_id, checkin_time)
       SELECT uid, (SELECT destination_id FROM destinations WHERE name = $2),
              NOW() - (random() * interval '2 hours')
         FROM unnest($1::int[]) AS uid`,
      [ids, d.name],
    );
  }
  console.log(`[seed] ${needed} demo active check-ins created.`);
}

async function seedAll(client) {
  await client.query(
    `INSERT INTO interests (name) SELECT unnest($1::text[]) ON CONFLICT (name) DO NOTHING`,
    [INTERESTS],
  );

  for (const d of DESTINATIONS) {
    const { rows } = await client.query(
      `INSERT INTO destinations (name, description, region, latitude, longitude, area_radius_m, capacity_threshold,
                                 risk_status, access_info, attractions, activities, accommodation_available, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING destination_id`,
      [d.name, d.description, d.region, d.latitude, d.longitude, d.areaRadiusM, d.capacityThreshold,
        d.riskStatus, d.accessInfo, d.attractions, d.activities, d.accommodationAvailable, d.imageUrl],
    );
    const id = rows[0].destination_id;
    await client.query(
      `INSERT INTO destination_interests (destination_id, interest_id)
       SELECT $1, interest_id FROM interests WHERE name = ANY($2::text[])`,
      [id, d.interests],
    );
    for (const c of d.culture) {
      await client.query(
        'INSERT INTO cultural_info (destination_id, category, title, content) VALUES ($1, $2, $3, $4)',
        [id, c.category, c.title, c.content],
      );
    }
    // Stored as "last available" weather; refreshed from OpenWeatherMap when an API key is configured
    await client.query(
      `INSERT INTO weather_info (destination_id, temperature, condition, description, weather_code, icon, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() - interval '45 minutes')`,
      [id, d.weather.temperature, d.weather.condition, d.weather.description, d.weather.weatherCode, d.weather.icon],
    );
  }
  console.log(`[seed] ${DESTINATIONS.length} destinations created.`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userIds = {};
  for (const u of DEMO_USERS) {
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, location_consent)
       VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
      [u.fullName, u.email, passwordHash, u.role, u.locationConsent],
    );
    userIds[u.role] = rows[0].user_id;
    await client.query(
      `INSERT INTO user_interests (user_id, interest_id)
       SELECT $1, interest_id FROM interests WHERE name = ANY($2::text[])`,
      [rows[0].user_id, u.interests],
    );
    for (const v of u.visits) {
      await client.query(
        `INSERT INTO visits (user_id, destination_id, visit_date, duration_min)
         VALUES ($1, (SELECT destination_id FROM destinations WHERE name = $2), CURRENT_DATE - $3::int, $4)`,
        [rows[0].user_id, v.destination, v.daysAgo, v.durationMin],
      );
    }
  }
  console.log(`[seed] ${DEMO_USERS.length} demo accounts created (password: ${DEMO_PASSWORD}).`);

  for (const d of DESTINATIONS) {
    for (const h of d.hazards || []) {
      await client.query(
        `INSERT INTO hazard_reports (observer_id, destination_id, reviewed_by, hazard_type, location, description, status, created_at)
         VALUES ($1, (SELECT destination_id FROM destinations WHERE name = $2), $3, $4, $5, $6, $7, NOW() - interval '3 hours')`,
        [userIds.community_safety_observer, d.name, userIds.administrator, h.hazardType, h.location, h.description, h.status],
      );
    }
  }
  for (const h of UNVERIFIED_REPORTS) {
    await client.query(
      `INSERT INTO hazard_reports (observer_id, destination_id, hazard_type, location, description)
       VALUES ($1, (SELECT destination_id FROM destinations WHERE name = $2), $3, $4, $5)`,
      [userIds.community_safety_observer, h.destination, h.hazardType, h.location, h.description],
    );
  }

  await seedDemoCrowd(client);
}

// FR-01.02 - unique Tourist ID for every tourist account
async function assignTouristCodes(client) {
  await client.query(
    `UPDATE users SET tourist_code = 'RAH-' || to_char(created_at, 'YYYY') || '-' || lpad(user_id::text, 6, '0')
      WHERE role IN ('tourist', 'community_safety_observer') AND tourist_code IS NULL`,
  );
}

async function main() {
  const crowdOnly = process.argv.includes('--crowd-only');
  if (!crowdOnly) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM destinations');
    if (rows[0].n > 0) {
      console.log('[seed] Data already exists. Run `npm run db:reset` to recreate it, or `npm run seed:crowd` to refresh demo crowds.');
      return;
    }
  }
  await withTransaction(async (client) => {
    await (crowdOnly ? seedDemoCrowd(client) : seedAll(client));
    await assignTouristCodes(client);
  });
  console.log('[seed] Done. Restart the API (or wait one refresh cycle) to see updated crowd levels.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .catch((err) => {
      console.error('[seed] Failed:', err.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
