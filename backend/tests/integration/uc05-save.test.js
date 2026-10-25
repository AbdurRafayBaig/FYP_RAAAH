// UC-05 Save Destination (Expanded Use Case Table 42) - FR-02.07
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { DEST, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let token;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  token = await app.loginAs(USERS.tourist);
});
after(() => app.close());

const save = (id, t = token) => app.request('POST', `/destinations/${id}/save`, { token: t });
const unsave = (id, t = token) => app.request('DELETE', `/destinations/${id}/save`, { token: t });
const saved = (t = token) => app.request('GET', '/profile/saved', { token: t });

describe('UC-05 normal flow', () => {
  test('TC-05-01 a tourist saves a destination and sees a confirmation', async () => {
    const res = await save(DEST.hunza.id);
    assert.equal(res.status, 201);
    assert.equal(res.body.saved, true);
    assert.equal(res.body.alreadySaved, false);
    assert.match(res.body.message, /Hunza Valley has been added/);
  });

  test('TC-05-02 saved destinations are listed with current conditions, newest first', async () => {
    await save(DEST.hunza.id);
    await save(DEST.skardu.id);
    const res = await saved();
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.destinations.map((d) => d.name), ['Skardu', 'Hunza Valley']);
    assert.ok(res.body.destinations[0].crowd.crowdLevel);
    assert.ok(res.body.destinations[0].savedAt);
  });

  test('TC-05-03 the destination page says whether it is saved', async () => {
    assert.equal((await app.request('GET', `/destinations/${DEST.hunza.id}`, { token })).body.destination.saved, false);
    await save(DEST.hunza.id);
    assert.equal((await app.request('GET', `/destinations/${DEST.hunza.id}`, { token })).body.destination.saved, true);
  });

  test('TC-05-04 saved destinations belong to one tourist only', async () => {
    await save(DEST.hunza.id);
    const other = await app.loginAs(USERS.noConsent);
    assert.deepEqual((await saved(other)).body.destinations, []);
  });
});

describe('UC-05 alternative flow 3a - already saved', () => {
  test('TC-05-05 saving again informs the tourist and offers to remove it', async () => {
    await save(DEST.hunza.id);
    const res = await save(DEST.hunza.id);
    assert.equal(res.status, 200);
    assert.equal(res.body.alreadySaved, true);
    assert.match(res.body.message, /already in your saved destinations/);
    const { rows } = await app.db.query('SELECT COUNT(*)::int AS n FROM saved_destinations');
    assert.equal(rows[0].n, 1);
  });

  test('TC-05-06 a saved destination can be removed', async () => {
    await save(DEST.hunza.id);
    const res = await unsave(DEST.hunza.id);
    assert.equal(res.status, 200);
    assert.equal(res.body.saved, false);
    assert.deepEqual((await saved()).body.destinations, []);
  });
});

describe('UC-05 access and invalid input', () => {
  test('TC-05-07 signing in is required', async () => {
    assert.equal((await app.request('POST', `/destinations/${DEST.hunza.id}/save`)).status, 401);
    assert.equal((await app.request('GET', '/profile/saved')).status, 401);
  });

  test('TC-05-08 only tourists and observers can save', async () => {
    const admin = await app.loginAs(USERS.admin);
    assert.equal((await save(DEST.hunza.id, admin)).status, 403);
    const observer = await app.loginAs(USERS.observer);
    assert.equal((await save(DEST.hunza.id, observer)).status, 201);
  });

  test('TC-05-09 unknown and inactive destinations cannot be saved', async () => {
    for (const id of [99999, DEST.inactive.id, 'abc', -1]) {
      assert.equal((await save(id)).status, 404, String(id));
    }
  });
});
