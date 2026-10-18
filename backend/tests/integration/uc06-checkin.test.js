// UC-06 Check In at Destination (Expanded Use Case Table 43, Activity Fig. 8, SSD Fig. 25)
// FR-01.07, FR-03.01, FR-03.02, FR-03.04 - FR-03.06, FR-04.01, SRS 3.3.4
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { config } from '../../src/config.js';
import { getCache } from '../../src/data/cache.js';
import * as crowdService from '../../src/modules/crowd/crowdService.js';
import { DEST, FAR_AWAY, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let token;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  token = await app.loginAs(USERS.tourist);
});
after(() => app.close());

const at = (d) => ({ latitude: d.latitude, longitude: d.longitude });
const checkIn = (d, body = at(d), as = token) => app.request('POST', `/destinations/${d.id}/check-in`, { token: as, body });
const crowdOf = async (d) => (await app.request('GET', `/destinations/${d.id}`, { token })).body.destination.crowd;
const checkInsOf = async (userId) =>
  (await app.db.query('SELECT destination_id, status, checkout_time FROM check_ins WHERE user_id = $1 ORDER BY checkin_id', [userId])).rows;

describe('UC-06 normal flow', () => {
  test('TC-06-01 a tourist inside the destination area is checked in and gets a confirmation', async () => {
    const res = await checkIn(DEST.attabad);
    assert.equal(res.status, 201);
    assert.match(res.body.message, /^You are checked in at Attabad Lake\./);
    assert.equal(res.body.checkIn.destinationId, DEST.attabad.id);
    assert.equal(res.body.checkIn.status, 'active');
    assert.deepEqual(await checkInsOf(USERS.tourist.id), [{ destination_id: DEST.attabad.id, status: 'active', checkout_time: null }]);
  });

  test('TC-06-02 the active visitor count and crowd level are updated straight away', async () => {
    assert.deepEqual(await crowdOf(DEST.attabad).then((c) => [c.activeVisitors, c.crowdLevel]), [2, 'Low']);
    const res = await checkIn(DEST.attabad);
    assert.deepEqual([res.body.crowd.activeVisitors, res.body.crowd.crowdLevel], [3, 'Moderate']); // 3 of 5
    assert.deepEqual(await crowdOf(DEST.attabad).then((c) => [c.activeVisitors, c.crowdLevel]), [3, 'Moderate']);
    const { rows } = await app.db.query('SELECT crowd_level FROM destinations WHERE destination_id = $1', [DEST.attabad.id]);
    assert.equal(rows[0].crowd_level, 'Moderate');
  });

  test('TC-06-03 anywhere inside the area radius counts, just outside does not', async () => {
    // Attabad Lake has a 4 km radius; 0.03 degrees of latitude is about 3.3 km, 0.04 about 4.4 km
    const inside = await checkIn(DEST.attabad, { latitude: DEST.attabad.latitude + 0.03, longitude: DEST.attabad.longitude });
    assert.equal(inside.status, 201);
    const observer = await app.loginAs(USERS.observer);
    const outside = await checkIn(DEST.attabad, { latitude: DEST.attabad.latitude + 0.04, longitude: DEST.attabad.longitude }, observer);
    assert.equal(outside.status, 422);
  });

  test('TC-06-04 the destination page then shows the tourist as checked in here', async () => {
    await checkIn(DEST.attabad);
    const { checkInStatus } = (await app.request('GET', `/destinations/${DEST.attabad.id}`, { token })).body.destination;
    assert.equal(checkInStatus.checkedInHere, true);
    assert.equal(checkInStatus.activeCheckIn.destinationName, 'Attabad Lake');
    const active = await app.request('GET', '/check-ins/active', { token });
    assert.equal(active.body.checkIn.destinationId, DEST.attabad.id);
  });

  test('TC-06-05 a Community Safety Observer checks in like a tourist (Table 20)', async () => {
    const observer = await app.loginAs(USERS.observer);
    assert.equal((await checkIn(DEST.skardu, at(DEST.skardu), observer)).status, 201);
  });

  test('TC-06-06 the location is used for the area check only and is not stored (SRS 3.3.4)', async () => {
    await checkIn(DEST.attabad);
    const { rows } = await app.db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'check_ins' ORDER BY ordinal_position`,
    );
    assert.deepEqual(rows.map((r) => r.column_name), ['checkin_id', 'user_id', 'destination_id', 'checkin_time', 'checkout_time', 'status']);
  });
});

describe('UC-06 alternative flows', () => {
  test('TC-06-07 alt 3a: a tourist outside the destination area is rejected and nothing is recorded', async () => {
    const res = await checkIn(DEST.attabad, FAR_AWAY);
    assert.equal(res.status, 422);
    assert.match(res.body.error, /^Check-in rejected: you are about \d+\.\d km from Attabad Lake\. You must be within 4\.0 km/);
    assert.deepEqual(await checkInsOf(USERS.tourist.id), []);
    assert.equal((await crowdOf(DEST.attabad)).activeVisitors, 2);
  });

  test('TC-06-08 alt 2a: without a location (permission denied) there is no check-in', async () => {
    for (const body of [{}, { latitude: 36.32 }, { latitude: 'north', longitude: 'east' }, { latitude: 91, longitude: 74 }, { latitude: 36, longitude: 181 }, { latitude: null, longitude: null }]) {
      const res = await checkIn(DEST.attabad, body);
      assert.equal(res.status, 400, JSON.stringify(body));
      assert.match(res.body.error, /location/);
    }
    assert.deepEqual(await checkInsOf(USERS.tourist.id), []);
  });

  test('TC-06-09 pre-condition: a tourist who has not given location consent cannot check in (FR-01.07)', async () => {
    const noConsent = await app.loginAs(USERS.noConsent);
    const res = await checkIn(DEST.attabad, at(DEST.attabad), noConsent);
    assert.equal(res.status, 403);
    assert.match(res.body.error, /location consent/);
    assert.deepEqual(await checkInsOf(USERS.noConsent.id), []);
  });

  test('TC-06-10 checking in twice at the same destination is refused and counted once', async () => {
    await checkIn(DEST.attabad);
    const again = await checkIn(DEST.attabad);
    assert.equal(again.status, 409);
    assert.equal((await crowdOf(DEST.attabad)).activeVisitors, 3);
  });

  test('TC-06-11 checking in elsewhere closes the earlier check-in and records that visit (FR-04.01)', async () => {
    await checkIn(DEST.attabad);
    const res = await checkIn(DEST.skardu);
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.closedPrevious, { destinationId: DEST.attabad.id, destinationName: 'Attabad Lake' });

    const rows = await checkInsOf(USERS.tourist.id);
    assert.deepEqual(rows.map((r) => [r.destination_id, r.status]), [[DEST.attabad.id, 'auto_closed'], [DEST.skardu.id, 'active']]);
    assert.ok(rows[0].checkout_time);
    assert.equal((await crowdOf(DEST.attabad)).activeVisitors, 2);
    assert.equal((await crowdOf(DEST.skardu)).activeVisitors, 4);

    const visits = await app.db.query('SELECT count(*)::int AS n FROM visits WHERE user_id = $1 AND destination_id = $2 AND visit_date >= CURRENT_DATE - 1', [USERS.tourist.id, DEST.attabad.id]);
    assert.equal(visits.rows[0].n, 1);
  });

  test('TC-06-12 check-in at a destination that does not exist or is not active', async () => {
    assert.equal((await checkIn({ id: 9999 }, at(DEST.attabad))).status, 404);
    assert.equal((await checkIn(DEST.inactive)).status, 404);
  });

  test('TC-06-13 check-in needs a logged-in tourist', async () => {
    assert.equal((await app.request('POST', `/destinations/${DEST.attabad.id}/check-in`, { body: at(DEST.attabad) })).status, 401);
    const admin = await app.loginAs(USERS.admin);
    assert.equal((await checkIn(DEST.attabad, at(DEST.attabad), admin)).status, 403);
  });

  test('TC-06-14 check-in requests sent at the same moment leave one active check-in', async () => {
    const results = await Promise.all(Array.from({ length: 6 }, () => checkIn(DEST.attabad)));
    assert.deepEqual(results.map((r) => r.status).sort(), [201, 409, 409, 409, 409, 409]);
    assert.equal((await checkInsOf(USERS.tourist.id)).filter((r) => r.status === 'active').length, 1);
    assert.equal((await crowdOf(DEST.attabad)).activeVisitors, 3);
  });
});

describe('UC-06 crowd monitoring after check-in', () => {
  test('TC-06-15 enough check-ins move a destination through the levels of Table 11', async () => {
    // Move the fixture visitors to Fairy Meadows and give it a capacity threshold of 10 (FR-03.03)
    await app.db.query(`DELETE FROM check_ins WHERE user_id IN (SELECT user_id FROM users WHERE email LIKE 'visitor-%')`);
    await app.db.query('UPDATE destinations SET capacity_threshold = 10 WHERE destination_id = $1', [DEST.fairy.id]);
    const levels = [];
    for (const visitors of [5, 6, 10, 13]) {
      await app.db.query('DELETE FROM check_ins WHERE destination_id = $1', [DEST.fairy.id]);
      await app.db.query(
        `INSERT INTO check_ins (user_id, destination_id)
         SELECT user_id, $1::int FROM users WHERE email LIKE 'visitor-%' ORDER BY user_id LIMIT $2`,
        [DEST.fairy.id, visitors],
      );
      await crowdService.recalculate(DEST.fairy.id);
      levels.push((await crowdOf(DEST.fairy)).crowdLevel);
    }
    assert.deepEqual(levels, ['Low', 'Moderate', 'High', 'Critical']);
  });

  test('TC-06-16 a check-in is closed automatically after the configured time and becomes a visit (FR-03.02)', async () => {
    await checkIn(DEST.attabad);
    await app.db.query(`UPDATE check_ins SET checkin_time = NOW() - interval '7 hours' WHERE user_id = $1`, [USERS.tourist.id]);

    const { autoClosed } = await crowdService.runRefreshCycle();
    assert.equal(autoClosed, 1);
    const [row] = await checkInsOf(USERS.tourist.id);
    assert.equal(row.status, 'auto_closed');
    assert.equal((await crowdOf(DEST.attabad)).activeVisitors, 2);

    const visit = await app.db.query('SELECT duration_min FROM visits WHERE user_id = $1 AND visit_date >= CURRENT_DATE - 1 ORDER BY visit_id DESC LIMIT 1', [USERS.tourist.id]);
    assert.ok(visit.rows[0].duration_min >= 419 && visit.rows[0].duration_min <= 421);
    assert.equal((await app.request('GET', '/check-ins/active', { token })).body.checkIn, null);
  });

  test('TC-06-17 a check-in younger than the configured time stays open', async () => {
    await checkIn(DEST.attabad);
    await app.db.query(`UPDATE check_ins SET checkin_time = NOW() - interval '5 hours' WHERE user_id = $1`, [USERS.tourist.id]);
    assert.equal((await crowdService.runRefreshCycle()).autoClosed, 0);
    assert.equal((await checkInsOf(USERS.tourist.id))[0].status, 'active');
  });

  test('TC-06-18 on serverless instances without Redis the cached crowd level is kept for 10 seconds only', async () => {
    const ttlOf = (d) => (getCache().store.get(`crowd:${d.id}`).expiresAt - Date.now()) / 1000;
    await crowdService.recalculate(DEST.attabad.id);
    assert.ok(ttlOf(DEST.attabad) > 60);
    config.isServerless = true;
    try {
      await crowdService.recalculate(DEST.attabad.id);
      assert.ok(ttlOf(DEST.attabad) <= 10 && ttlOf(DEST.attabad) > 8);
    } finally {
      config.isServerless = false;
    }
  });
});
