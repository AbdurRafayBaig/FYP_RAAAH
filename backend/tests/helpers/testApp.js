// Shared harness for the integration tests: a real PostgreSQL test database, the Express app on a
// free port and a stand-in for the AI Recommendation Engine.
import http from 'node:http';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { config } from '../../src/config.js';
import { createApp } from '../../src/app.js';
import { pool, query } from '../../src/data/db.js';
import { migrate } from '../../src/db/migrate.js';
import { INTERESTS } from '../../src/domain.js';
import * as crowdService from '../../src/modules/crowd/crowdService.js';

export const PASSWORD = 'Test@12345';

export const USERS = {
  tourist: { id: 1, email: 'tourist@test.pk', fullName: 'Ali Raza', role: 'tourist' },
  noConsent: { id: 2, email: 'noconsent@test.pk', fullName: 'Sara Khan', role: 'tourist' },
  observer: { id: 3, email: 'observer@test.pk', fullName: 'Karim Baig', role: 'community_safety_observer' },
  admin: { id: 4, email: 'admin@test.pk', fullName: 'Test Administrator', role: 'administrator' },
  authority: { id: 5, email: 'authority@test.pk', fullName: 'Test Authority', role: 'tourism_authority' },
};

// Capacity and active check-ins are chosen so every crowd level of Table 11 is present.
export const DEST = {
  hunza: { id: 1, name: 'Hunza Valley', latitude: 36.3236, longitude: 74.666, capacity: 10, active: 10 }, // High
  attabad: { id: 2, name: 'Attabad Lake', latitude: 36.32, longitude: 74.865, capacity: 5, active: 2 }, // Low
  fairy: { id: 3, name: 'Fairy Meadows', latitude: 35.3872, longitude: 74.5786, capacity: 30, active: 0 }, // Low, Elevated Risk
  naran: { id: 4, name: 'Naran Valley', latitude: 34.909, longitude: 73.6507, capacity: 5, active: 7 }, // Critical, High Risk
  inactive: { id: 5, name: 'Old Camp Site', latitude: 35.0, longitude: 74.0, capacity: 10, active: 0 }, // not listed
  skardu: { id: 6, name: 'Skardu', latitude: 35.2971, longitude: 75.6333, capacity: 5, active: 3 }, // Moderate
};

// Karachi - far outside every destination area
export const FAR_AWAY = { latitude: 24.8607, longitude: 67.0011 };

let passwordHash;

function assertTestDatabase() {
  const name = new URL(config.databaseUrl).pathname.slice(1);
  if (!name.endsWith('_test')) {
    throw new Error(`Refusing to run tests against "${name}": the test database name must end with "_test".`);
  }
  return name;
}

async function ensureTestDatabase() {
  const name = assertTestDatabase();
  const adminUrl = new URL(config.databaseUrl);
  adminUrl.pathname = '/postgres';
  const client = new pg.Client({ connectionString: adminUrl.toString() });
  try {
    await client.connect();
  } catch (err) {
    throw new Error(
      `Cannot reach PostgreSQL for the tests (${err.message}). Start it with \`npm run db:local\` or set TEST_DATABASE_URL.`,
    );
  }
  try {
    const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
    if (rows.length === 0) await client.query(`CREATE DATABASE "${name}"`);
  } finally {
    await client.end();
  }
}

async function insertFixtures() {
  await query('INSERT INTO interests (name) SELECT unnest($1::text[])', [INTERESTS]);

  const destinations = [
    [DEST.hunza, 'Hunza, Gilgit-Baltistan', 8000, 'Low Risk', { status: 'Open', road: 'Karakoram Highway', notes: 'Paved road.' },
      ['Baltit Fort', 'Altit Fort'], ['Fort tours'], 42, true, ['Nature', 'Culture', 'Photography']],
    [DEST.attabad, 'Gojal, Hunza, Gilgit-Baltistan', 4000, 'Low Risk', { status: 'Open' },
      ['Main boating jetty'], ['Boating'], 18, true, ['Nature', 'Adventure', 'Photography']],
    [DEST.fairy, 'Diamer, Gilgit-Baltistan', 5000, 'Elevated Risk', { status: 'Limited', road: 'Jeep track from Raikot Bridge' },
      ['Nanga Parbat viewpoint'], ['Trekking'], 8, true, ['Nature', 'Adventure']],
    [DEST.naran, 'Kaghan, Khyber Pakhtunkhwa', 6000, 'High Risk', { status: 'Closed', road: 'N-15 blocked' },
      ['Saif-ul-Malook'], ['Boating'], 30, true, ['Nature']],
    [DEST.inactive, 'Nowhere', 3000, 'Low Risk', { status: 'Open' }, [], [], 0, false, ['Nature']],
    [DEST.skardu, 'Skardu, Gilgit-Baltistan', 10000, 'Low Risk', { status: 'Open' },
      ['Kharpocho Fort'], ['Sightseeing'], 25, true, ['Historical Sites', 'Culture']],
  ];
  for (const [d, region, radius, risk, access, attractions, activities, rooms, active, interests] of destinations) {
    await query(
      `INSERT INTO destinations (name, description, region, latitude, longitude, area_radius_m, capacity_threshold,
                                 risk_status, access_info, attractions, activities, accommodation_available, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [d.name, `About ${d.name}.`, region, d.latitude, d.longitude, radius, d.capacity, risk, access,
        attractions, activities, rooms, active],
    );
    await query(
      `INSERT INTO destination_interests (destination_id, interest_id)
       SELECT $1, interest_id FROM interests WHERE name = ANY($2::text[])`,
      [d.id, interests],
    );
  }

  // Last available weather, 45 minutes old; Fairy Meadows has a thunderstorm (unfavourable)
  await query(
    `INSERT INTO weather_info (destination_id, temperature, condition, description, weather_code, icon, updated_at)
     SELECT destination_id,
            CASE WHEN destination_id = $1 THEN 9 ELSE 18 END,
            CASE WHEN destination_id = $1 THEN 'Thunderstorm' ELSE 'Clear' END,
            CASE WHEN destination_id = $1 THEN 'thunderstorm' ELSE 'clear sky' END,
            CASE WHEN destination_id = $1 THEN 211 ELSE 800 END,
            '01d', NOW() - interval '45 minutes'
       FROM destinations`,
    [DEST.fairy.id],
  );

  await query(
    `INSERT INTO cultural_info (destination_id, category, title, content) VALUES
       ($1, 'history', 'Forts of the Mirs of Hunza', 'Baltit Fort served as the seat of the Mirs of Hunza.'),
       ($1, 'etiquette', 'Respectful behaviour', 'Ask permission before photographing local people.')`,
    [DEST.hunza.id],
  );

  passwordHash ||= await bcrypt.hash(PASSWORD, 4);
  const people = [
    [USERS.tourist, true, ['Nature', 'Photography']],
    [USERS.noConsent, false, ['Culture']],
    [USERS.observer, true, ['Nature', 'Culture']],
    [USERS.admin, false, []],
    [USERS.authority, false, []],
  ];
  for (const [u, consent, interests] of people) {
    await query(
      `INSERT INTO users (full_name, email, password_hash, role, location_consent, tourist_code)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [u.fullName, u.email, passwordHash, u.role, consent,
        u.role === 'tourist' || u.role === 'community_safety_observer' ? `RAH-2026-${String(u.id).padStart(6, '0')}` : null],
    );
    await query(
      `INSERT INTO user_interests (user_id, interest_id)
       SELECT $1, interest_id FROM interests WHERE name = ANY($2::text[])`,
      [u.id, interests],
    );
  }
  // Visit history of the tourist (FR-04.03)
  await query(
    `INSERT INTO visits (user_id, destination_id, visit_date, duration_min) VALUES
       ($1, $2, CURRENT_DATE - 200, 2880), ($1, $2, CURRENT_DATE - 40, 1440)`,
    [USERS.tourist.id, DEST.attabad.id],
  );

  // Only the Verified report may reach public pages (FR-07.04)
  await query(
    `INSERT INTO hazard_reports (observer_id, destination_id, reviewed_by, hazard_type, location, description, status) VALUES
       ($1, $2, $3, 'Landslide', 'Raikot Bridge track', 'Debris on the jeep track.', 'Verified'),
       ($1, $2, NULL, 'Rockfall', 'Tato village', 'Loose rocks reported.', 'Unverified'),
       ($1, $2, $3, 'Flash Flood', 'Raikot stream', 'Could not be confirmed.', 'Rejected')`,
    [USERS.observer.id, DEST.fairy.id, USERS.admin.id],
  );

  // Other visitors currently checked in, so that crowd levels differ per destination (FR-03.04)
  for (const d of Object.values(DEST)) {
    if (d.active === 0) continue;
    await query(
      `WITH visitors AS (
         INSERT INTO users (full_name, email, password_hash, role)
         SELECT 'Visitor ' || n, 'visitor-' || $1::int || '-' || n || '@test.pk', $2, 'tourist'
           FROM generate_series(1, $3::int) AS n
         RETURNING user_id
       )
       INSERT INTO check_ins (user_id, destination_id) SELECT user_id, $1::int FROM visitors`,
      [d.id, passwordHash, d.active],
    );
  }
}

// Empties every table and loads the fixtures again; ids restart from 1.
export async function resetData() {
  assertTestDatabase();
  await query(
    `TRUNCATE users, interests, destinations, check_ins, visits, recommendations, hazard_reports,
              notifications, cultural_info, weather_info, saved_destinations RESTART IDENTITY CASCADE`,
  );
  await insertFixtures();
  await crowdService.recalculate();
}

function startAiStub() {
  const stub = {
    requests: [],
    // 'rank' answers like the real engine, 'empty' finds nothing suitable, 'error' fails
    mode: 'rank',
  };
  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(raw || '{}');
      stub.requests.push(payload);
      if (stub.mode === 'error') {
        res.writeHead(500, { 'Content-Type': 'application/json' }).end('{"detail":"boom"}');
        return;
      }
      const candidates = stub.mode === 'empty' ? [] : payload.destinations.filter(
        (d) => d.destinationId !== payload.sourceDestinationId &&
          d.riskStatus !== 'High Risk' && d.crowdLevel !== 'Critical' && d.accessStatus !== 'Closed',
      );
      const recommendations = candidates.slice(0, payload.limit).map((d, i) => ({
        destinationId: d.destinationId,
        score: Number((0.9 - i * 0.1).toFixed(4)),
        rank: i + 1,
        factors: { preference: 0.5, crowd: 1 },
        reasons: ['Good weather'],
        previouslyVisited: Boolean(payload.tourist.visitCounts[d.destinationId]),
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({
        recommendations,
        excluded: payload.destinations.length - recommendations.length,
        engine: { approach: 'stub', version: 'test' },
      }));
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      stub.url = `http://127.0.0.1:${server.address().port}`;
      stub.close = () => new Promise((done) => server.close(done));
      resolve(stub);
    });
  });
}

export async function startTestApp() {
  await ensureTestDatabase();
  const log = console.log;
  console.log = () => {};
  try {
    await migrate({ reset: true });
  } finally {
    console.log = log;
  }

  const aiStub = await startAiStub();
  config.aiEngineUrl = aiStub.url;

  const server = await new Promise((resolve) => {
    const s = createApp().listen(0, '127.0.0.1', () => resolve(s));
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}/api`;

  async function request(method, path, { token, body, headers } = {}) {
    const res = await fetch(baseUrl + path, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    return { status: res.status, headers: res.headers, body: await res.json().catch(() => ({})) };
  }

  async function loginAs(user) {
    const res = await request('POST', '/auth/login', { body: { email: user.email, password: PASSWORD } });
    if (res.status !== 200) throw new Error(`Login failed for ${user.email}: ${res.status}`);
    return res.body.token;
  }

  async function close() {
    await new Promise((done) => server.close(done));
    await aiStub.close();
    await pool.end();
  }

  return { request, loginAs, aiStub, close, db: { query } };
}
