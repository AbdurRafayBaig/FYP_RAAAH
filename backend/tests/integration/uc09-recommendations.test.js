// UC-09 Get Alternative Destination Recommendations (Expanded Use Case Table 46, SSD Fig. 28, DFD Fig. 42)
// FR-01.07, FR-03.07, FR-04.03, FR-05.01 - FR-05.06
// The AI Recommendation Engine is replaced by a stand-in here; its own scoring is tested in ai-engine/tests.
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { config } from '../../src/config.js';
import { DEST, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let token;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  app.aiStub.mode = 'rank';
  app.aiStub.requests.length = 0;
  token = await app.loginAs(USERS.tourist);
});
after(() => app.close());

const recommend = (body = {}, as = token) => app.request('POST', '/recommendations', { token: as, body });
const sentToEngine = () => app.aiStub.requests.at(-1);

describe('UC-09 normal flow', () => {
  test('TC-09-01 steps 2-3: preferences, visit history and current conditions of every destination reach the engine', async () => {
    const res = await recommend({ sourceDestinationId: DEST.hunza.id });
    assert.equal(res.status, 200);

    const payload = sentToEngine();
    assert.deepEqual(payload.tourist.interests, ['Nature', 'Photography']); // FR-05.03 preferences
    assert.deepEqual(payload.tourist.visitCounts, { [DEST.attabad.id]: 2 }); // FR-04.03 visit history
    assert.equal(payload.sourceDestinationId, DEST.hunza.id);
    assert.equal(payload.limit, 5);

    const byId = Object.fromEntries(payload.destinations.map((d) => [d.destinationId, d]));
    assert.deepEqual(Object.keys(byId).map(Number).sort(), [1, 2, 3, 4, 6]); // the inactive destination is not a candidate
    assert.deepEqual(byId[DEST.fairy.id], {
      destinationId: DEST.fairy.id,
      name: 'Fairy Meadows',
      interests: ['Nature', 'Adventure'], // destination characteristics
      latitude: DEST.fairy.latitude,
      longitude: DEST.fairy.longitude,
      crowdLevel: 'Low', // FR-03.07
      riskStatus: 'Elevated Risk',
      accessStatus: 'Limited',
      weatherUnfavourable: true,
      accommodationAvailable: 8,
    });
    assert.equal(byId[DEST.hunza.id].crowdLevel, 'High');
    assert.equal(byId[DEST.naran.id].crowdLevel, 'Critical');
  });

  test('TC-09-02 steps 4-6: the ranked alternatives are returned in order with their details', async () => {
    const res = await recommend({ sourceDestinationId: DEST.hunza.id });
    const { recommendations } = res.body;
    assert.deepEqual(recommendations.map((r) => r.rank), [1, 2, 3]);
    assert.deepEqual(recommendations.map((r) => r.destination.name), ['Attabad Lake', 'Fairy Meadows', 'Skardu']);
    assert.ok(recommendations[0].score > recommendations[1].score);
    for (const r of recommendations) {
      assert.ok(r.reasons.length > 0);
      assert.ok(r.destination.crowd.crowdLevel);
      assert.ok(r.destination.riskStatus);
      assert.ok(r.destination.weather);
    }
    assert.equal(recommendations[0].previouslyVisited, true); // visited before, still recommended (FR-04.03)
    assert.equal(res.body.noSuitableAlternative, false);
    assert.deepEqual(res.body.engine, { approach: 'stub', version: 'test' });
  });

  test('TC-09-03 the selected destination comes back with the reasons alternatives are suggested (FR-05.01, FR-05.02)', async () => {
    const { source } = (await recommend({ sourceDestinationId: DEST.hunza.id })).body;
    assert.equal(source.name, 'Hunza Valley');
    assert.equal(source.advisory.needsAlternatives, true);
    assert.deepEqual(source.advisory.reasons, ['Crowd level is High.']);
    assert.deepEqual(source.preferenceMatch, ['Nature', 'Photography']);
  });

  test('TC-09-04 the selected destination is never recommended as its own alternative', async () => {
    const { recommendations } = (await recommend({ sourceDestinationId: DEST.attabad.id })).body;
    assert.equal(recommendations.some((r) => r.destination.destinationId === DEST.attabad.id), false);
  });

  test('TC-09-05 the tourist can ask for recommendations without selecting a destination', async () => {
    const res = await recommend();
    assert.equal(res.status, 200);
    assert.equal(res.body.source, null);
    assert.equal(sentToEngine().sourceDestinationId, null);
    assert.ok(res.body.recommendations.length > 0);
  });

  test('TC-09-06 every recommendation is stored with its score and rank (DFD data store D7)', async () => {
    await recommend({ sourceDestinationId: DEST.hunza.id });
    const { rows } = await app.db.query(
      `SELECT user_id, source_destination_id, recommended_destination_id, score::float8 AS score, rank_position
         FROM recommendations ORDER BY rank_position`,
    );
    assert.deepEqual(rows, [
      { user_id: 1, source_destination_id: 1, recommended_destination_id: 2, score: 0.9, rank_position: 1 },
      { user_id: 1, source_destination_id: 1, recommended_destination_id: 3, score: 0.8, rank_position: 2 },
      { user_id: 1, source_destination_id: 1, recommended_destination_id: 6, score: 0.7, rank_position: 3 },
    ]);
  });

  test('TC-09-07 step 7: a recommended destination can be opened for its details', async () => {
    const { recommendations } = (await recommend({ sourceDestinationId: DEST.hunza.id })).body;
    const res = await app.request('GET', `/destinations/${recommendations[0].destination.destinationId}`, { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.destination.name, recommendations[0].destination.name);
  });

  test('TC-09-08 changed preferences are used for the next recommendation (UC-03 post-condition)', async () => {
    await app.request('PUT', '/profile', { token, body: { fullName: 'Ali Raza', email: USERS.tourist.email, interests: ['Culture'], locationConsent: true } });
    await recommend();
    assert.deepEqual(sentToEngine().tourist.interests, ['Culture']);
  });

  test('TC-09-09 a new check-in changes the crowd level the engine receives (FR-03.07)', async () => {
    await app.request('POST', `/destinations/${DEST.attabad.id}/check-in`, { token, body: { latitude: DEST.attabad.latitude, longitude: DEST.attabad.longitude } });
    await recommend();
    assert.equal(sentToEngine().destinations.find((d) => d.destinationId === DEST.attabad.id).crowdLevel, 'Moderate');
  });
});

describe('UC-09 location and consent (FR-01.07)', () => {
  const here = { latitude: 35.92, longitude: 74.31 }; // Gilgit

  test('TC-09-10 with consent the current location of the tourist is used for distance', async () => {
    const res = await recommend({ ...here });
    assert.equal(res.body.usedLocation, true);
    assert.deepEqual(sentToEngine().tourist.location, here);
  });

  test('TC-09-11 without consent the location is ignored even when the browser sends it', async () => {
    const noConsent = await app.loginAs(USERS.noConsent);
    const res = await recommend({ ...here }, noConsent);
    assert.equal(res.status, 200);
    assert.equal(res.body.usedLocation, false);
    assert.equal(sentToEngine().tourist.location, null);
  });

  test('TC-09-12 a location that is not valid is rejected', async () => {
    for (const body of [{ latitude: 95, longitude: 74 }, { latitude: 'x', longitude: 'y' }, { latitude: 35.9 }, { latitude: 35.9, longitude: null }]) {
      assert.equal((await recommend(body)).status, 400, JSON.stringify(body));
    }
    assert.equal(app.aiStub.requests.length, 0);
  });

  test('TC-09-13 the location is not stored with the recommendations (SRS 3.3.4)', async () => {
    await recommend({ ...here });
    const { rows } = await app.db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'recommendations' ORDER BY ordinal_position`,
    );
    assert.deepEqual(rows.map((r) => r.column_name), ['recommendation_id', 'user_id', 'source_destination_id', 'recommended_destination_id', 'score', 'rank_position', 'created_at']);
  });
});

describe('UC-09 alternative flows', () => {
  test('TC-09-14 alt 6a: no suitable alternative - the tourist is told and sees the safety information of the selection', async () => {
    app.aiStub.mode = 'empty';
    const res = await recommend({ sourceDestinationId: DEST.fairy.id });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.recommendations, []);
    assert.equal(res.body.noSuitableAlternative, true);
    assert.match(res.body.message, /^No suitable alternative destination was found/);
    assert.equal(res.body.source.riskStatus, 'Elevated Risk');
    assert.deepEqual(res.body.source.hazards.map((h) => h.hazardType), ['Landslide']);
    assert.ok(res.body.source.weather);
    const stored = await app.db.query('SELECT count(*)::int AS n FROM recommendations');
    assert.equal(stored.rows[0].n, 0);
  });

  test('TC-09-15 alt 7a: the tourist continues with the original destination, which stays available (FR-05.06)', async () => {
    const { source } = (await recommend({ sourceDestinationId: DEST.hunza.id })).body;
    const res = await app.request('GET', `/destinations/${source.destinationId}`, { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.destination.name, 'Hunza Valley');
  });

  test('TC-09-16 a selected destination that does not exist or is not active', async () => {
    for (const sourceDestinationId of [9999, DEST.inactive.id, 'abc', -3]) {
      assert.equal((await recommend({ sourceDestinationId })).status, 404, String(sourceDestinationId));
    }
  });
});

describe('UC-09 when the AI Recommendation Engine has a problem (SRS 3.3.5)', () => {
  test('TC-09-17 the engine cannot be reached: a clear message, not a crash', async (t) => {
    const url = config.aiEngineUrl;
    config.aiEngineUrl = 'http://127.0.0.1:9'; // nothing listens here
    t.after(() => { config.aiEngineUrl = url; });
    t.mock.method(console, 'error', () => {});
    const res = await recommend({ sourceDestinationId: DEST.hunza.id });
    assert.equal(res.status, 503);
    assert.match(res.body.error, /recommendation engine is currently unavailable/);
    // the rest of the system keeps working
    assert.equal((await app.request('GET', `/destinations/${DEST.hunza.id}`, { token })).status, 200);
  });

  test('TC-09-18 the engine answers with an error', async (t) => {
    app.aiStub.mode = 'error';
    t.mock.method(console, 'error', () => {});
    const res = await recommend();
    assert.equal(res.status, 502);
  });
});

describe('UC-09 pre-condition - tourist is logged in', () => {
  test('TC-09-19 recommendations need a logged-in tourist or observer', async () => {
    assert.equal((await app.request('POST', '/recommendations', { body: {} })).status, 401);
    for (const user of [USERS.admin, USERS.authority]) {
      assert.equal((await recommend({}, await app.loginAs(user))).status, 403);
    }
    assert.equal((await recommend({}, await app.loginAs(USERS.observer))).status, 200);
  });
});
