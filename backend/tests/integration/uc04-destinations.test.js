// UC-04 Explore Destinations (Expanded Use Case Table 41, SSD Fig. 23)
// FR-02.01 - FR-02.06, FR-03.04 - FR-03.06, FR-06.03, FR-07.04, SRS 3.3.4, 3.3.5
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { config } from '../../src/config.js';
import { DEST, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let token;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  token = await app.loginAs(USERS.tourist);
});
after(() => app.close());

const list = (search = '') => app.request('GET', `/destinations${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token });
const page = (id) => app.request('GET', `/destinations/${id}`, { token });
const byName = (res) => Object.fromEntries(res.body.destinations.map((d) => [d.name, d]));

describe('UC-04 steps 1-2 - registered destinations for the list and the map', () => {
  test('TC-04-01 every active destination is listed with its location, crowd, safety, weather and access', async () => {
    const res = await list();
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.destinations.map((d) => d.name), ['Attabad Lake', 'Fairy Meadows', 'Hunza Valley', 'Naran Valley', 'Skardu']);
    for (const d of res.body.destinations) {
      assert.equal(typeof d.location.latitude, 'number'); // needed to place it on the map (FR-02.02)
      assert.equal(typeof d.location.longitude, 'number');
      assert.ok(d.crowd.crowdLevel);
      assert.ok(d.riskStatus);
      assert.ok(d.accessInfo.status);
      assert.ok(d.weather.condition);
    }
  });

  test('TC-04-02 a destination that is not active is not shown and cannot be opened', async () => {
    assert.equal((await list()).body.destinations.some((d) => d.name === DEST.inactive.name), false);
    assert.equal((await page(DEST.inactive.id)).status, 404);
  });

  test('TC-04-03 crowd levels follow Table 11 from active check-ins and the capacity threshold', async () => {
    const d = byName(await list());
    assert.deepEqual(d['Attabad Lake'].crowd.crowdLevel, 'Low'); // 2 of 5
    assert.deepEqual(d.Skardu.crowd.crowdLevel, 'Moderate'); // 3 of 5
    assert.deepEqual(d['Hunza Valley'].crowd.crowdLevel, 'High'); // 10 of 10
    assert.deepEqual(d['Naran Valley'].crowd.crowdLevel, 'Critical'); // 7 of 5
    assert.equal(d['Hunza Valley'].crowd.activeVisitors, 10);
    assert.equal(d['Hunza Valley'].crowd.capacityThreshold, 10);
  });

  test('TC-04-04 crowd information is aggregated: no visitor identity or position leaves the server (FR-03.06)', async () => {
    const text = JSON.stringify([(await list()).body, (await page(DEST.hunza.id)).body]);
    assert.equal(/visitor-\d|userId|user_id|@test\.pk/.test(text), false);
    assert.deepEqual(Object.keys((await page(DEST.hunza.id)).body.destination.crowd).sort(), ['activeVisitors', 'capacityThreshold', 'crowdLevel', 'updatedAt']);
  });
});

describe('UC-04 step 3 - search', () => {
  test('TC-04-05 search by name, region or attraction, in any letter case', async () => {
    assert.deepEqual((await list('hunza')).body.destinations.map((d) => d.name), ['Attabad Lake', 'Hunza Valley']); // region of Attabad is Hunza
    assert.deepEqual((await list('SKARDU')).body.destinations.map((d) => d.name), ['Skardu']);
    assert.deepEqual((await list('baltit fort')).body.destinations.map((d) => d.name), ['Hunza Valley']);
  });

  test('TC-04-06 alt 3a: no destination matches the search', async () => {
    const res = await list('atlantis');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.destinations, []);
    assert.equal(res.body.message, 'No destinations found');
  });

  test('TC-04-07 search text is treated as text, not as SQL or a pattern', async () => {
    assert.equal((await list("'; DROP TABLE destinations; --")).status, 200);
    assert.equal((await list()).body.destinations.length, 5);
    for (const wildcard of ['%', '_', 'h_nza']) assert.deepEqual((await list(wildcard)).body.destinations, [], wildcard);
  });
});

describe('UC-04 steps 4-6 - the destination page', () => {
  test('TC-04-08 the page shows name, description, location, attractions, activities and background', async () => {
    const res = await page(DEST.hunza.id);
    assert.equal(res.status, 200);
    const d = res.body.destination;
    assert.equal(d.name, 'Hunza Valley');
    assert.equal(d.description, 'About Hunza Valley.');
    assert.deepEqual(d.location, { latitude: DEST.hunza.latitude, longitude: DEST.hunza.longitude });
    assert.deepEqual(d.attractions, ['Baltit Fort', 'Altit Fort']);
    assert.deepEqual(d.activities, ['Fort tours']);
    assert.deepEqual(d.culturalInfo.map((c) => c.category), ['etiquette', 'history']);
    assert.equal(d.accessInfo.road, 'Karakoram Highway');
  });

  test('TC-04-09 only Verified hazard reports are public (FR-07.04)', async () => {
    const d = (await page(DEST.fairy.id)).body.destination;
    assert.equal(d.riskStatus, 'Elevated Risk');
    assert.deepEqual(d.hazards.map((h) => h.hazardType), ['Landslide']);
    assert.equal('observerId' in d.hazards[0], false);
  });

  test('TC-04-10 alt 6a: a crowded destination carries a warning and offers alternatives', async () => {
    const { advisory } = (await page(DEST.hunza.id)).body.destination;
    assert.equal(advisory.crowded, true);
    assert.equal(advisory.needsAlternatives, true);
    assert.deepEqual(advisory.reasons, ['Crowd level is High.']);
  });

  test('TC-04-11 alt 6a: an unsafe destination with bad weather lists every reason', async () => {
    const { advisory } = (await page(DEST.fairy.id)).body.destination;
    assert.equal(advisory.unsafe, true);
    assert.equal(advisory.unfavourableWeather, true);
    assert.equal(advisory.needsAlternatives, true);
    assert.equal(advisory.reasons.length, 4); // risk status, verified hazard, limited access, weather
  });

  test('TC-04-12 a quiet, safe destination has no warning', async () => {
    const { advisory } = (await page(DEST.attabad.id)).body.destination;
    assert.equal(advisory.needsAlternatives, false);
  });

  test('TC-04-13 the page says which of the tourist preferences the destination matches (FR-05.01)', async () => {
    assert.deepEqual((await page(DEST.hunza.id)).body.destination.preferenceMatch, ['Nature', 'Photography']);
    assert.deepEqual((await page(DEST.skardu.id)).body.destination.preferenceMatch, []);
  });

  test('TC-04-14 a destination that does not exist gives "not found"', async () => {
    for (const id of [9999, 0, -1, 'abc', '1.5']) assert.equal((await page(id)).status, 404, String(id));
  });
});

describe('UC-04 step 5 - weather from OpenWeatherMap', () => {
  const realFetch = globalThis.fetch;
  const withWeatherService = (t, respond) => {
    config.openWeatherApiKey = 'test-key';
    t.after(() => { config.openWeatherApiKey = ''; });
    const calls = [];
    t.mock.method(globalThis, 'fetch', (url, options) => {
      if (!String(url).includes('api.openweathermap.org')) return realFetch(url, options);
      calls.push(String(url));
      return respond();
    });
    return calls;
  };

  test('TC-04-15 current weather is fetched for the coordinates of the destination and stored', async (t) => {
    const calls = withWeatherService(t, async () => Response.json({
      main: { temp: 21.36 }, weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
    }));
    const { weather } = (await page(DEST.attabad.id)).body.destination;
    assert.equal(calls.length, 1);
    assert.match(calls[0], /lat=36\.32&lon=74\.865&units=metric/);
    assert.deepEqual(
      { temperature: weather.temperature, condition: weather.condition, stale: weather.stale, unfavourable: weather.unfavourable },
      { temperature: 21.4, condition: 'Rain', stale: false, unfavourable: false },
    );
    const { rows } = await app.db.query('SELECT condition FROM weather_info WHERE destination_id = $1', [DEST.attabad.id]);
    assert.equal(rows[0].condition, 'Rain');
  });

  test('TC-04-16 fresh weather is reused instead of calling the service again', async (t) => {
    const calls = withWeatherService(t, async () => Response.json({ main: { temp: 10 }, weather: [{ id: 800, main: 'Clear' }] }));
    await page(DEST.attabad.id);
    await page(DEST.attabad.id);
    assert.equal(calls.length, 1);
  });

  for (const [name, respond] of [
    ['the service answers with an error', async () => new Response('{}', { status: 500 })],
    ['the service cannot be reached', async () => { throw new TypeError('fetch failed'); }],
  ]) {
    test(`TC-04-17 alt 5a: ${name} - the last available weather is shown with its update time`, async (t) => {
      withWeatherService(t, respond);
      t.mock.method(console, 'warn', () => {});
      const res = await page(DEST.attabad.id);
      assert.equal(res.status, 200);
      const { weather } = res.body.destination;
      assert.equal(weather.condition, 'Clear');
      assert.equal(weather.stale, true);
      const ageMinutes = (Date.now() - new Date(weather.updatedAt).getTime()) / 60000;
      assert.ok(ageMinutes > 44 && ageMinutes < 47, `update time is the stored one (${ageMinutes.toFixed(1)} min old)`);
    });
  }

  test('TC-04-18 without an API key the stored weather is shown as last available', async () => {
    const { weather } = (await page(DEST.attabad.id)).body.destination;
    assert.equal(weather.stale, true);
    assert.ok(weather.updatedAt);
  });
});

describe('UC-04 pre-condition - tourist is logged in', () => {
  test('TC-04-19 destinations cannot be browsed without logging in', async () => {
    assert.equal((await app.request('GET', '/destinations')).status, 401);
    assert.equal((await app.request('GET', `/destinations/${DEST.hunza.id}`)).status, 401);
  });

  test('TC-04-20 administrators and tourism authorities can view destinations too', async () => {
    for (const user of [USERS.admin, USERS.authority]) {
      const staff = await app.loginAs(user);
      assert.equal((await app.request('GET', '/destinations', { token: staff })).status, 200);
    }
  });
});
