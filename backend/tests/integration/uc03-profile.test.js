// UC-03 Manage Profile and Preferences (Expanded Use Case Table 40, SSD Fig. 22)
// FR-01.02, FR-01.04, FR-01.05, FR-01.07
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { PASSWORD, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let token;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  token = await app.loginAs(USERS.tourist);
});
after(() => app.close());

const valid = { fullName: 'Ali Raza Khan', email: 'ali.raza@test.pk', interests: ['Culture', 'Adventure'], locationConsent: false };
const getProfile = () => app.request('GET', '/profile', { token });
const putProfile = (body) => app.request('PUT', '/profile', { token, body });

describe('UC-03 normal flow', () => {
  test('TC-03-01 the profile page shows profile information, preferences and location consent', async () => {
    const res = await getProfile();
    assert.equal(res.status, 200);
    assert.deepEqual(
      { ...res.body.profile, createdAt: undefined },
      {
        userId: USERS.tourist.id,
        fullName: 'Ali Raza',
        email: USERS.tourist.email,
        role: 'tourist',
        touristCode: 'RAH-2026-000001',
        locationConsent: true,
        interests: ['Nature', 'Photography'],
        createdAt: undefined,
      },
    );
  });

  test('TC-03-02 the available travel preferences are the five of FR-01.04', async () => {
    const res = await app.request('GET', '/interests');
    assert.deepEqual(res.body.interests, ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography']);
  });

  test('TC-03-03 valid changes are saved and confirmed', async () => {
    const res = await putProfile(valid);
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Your profile and preferences have been saved.');
    assert.equal(res.body.profile.fullName, valid.fullName);

    const saved = (await getProfile()).body.profile;
    assert.equal(saved.fullName, valid.fullName);
    assert.equal(saved.email, valid.email);
    assert.deepEqual(saved.interests, ['Adventure', 'Culture']);
    assert.equal(saved.locationConsent, false);
  });

  test('TC-03-04 the Tourist ID and role cannot be changed through the profile', async () => {
    await putProfile({ ...valid, touristCode: 'RAH-0000-000000', role: 'administrator', userId: 99 });
    const saved = (await getProfile()).body.profile;
    assert.equal(saved.touristCode, 'RAH-2026-000001');
    assert.equal(saved.role, 'tourist');
    assert.equal(saved.userId, USERS.tourist.id);
  });

  test('TC-03-05 all preferences can be removed', async () => {
    const res = await putProfile({ ...valid, interests: [] });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.profile.interests, []);
  });

  test('TC-03-06 the name is tidied and the email stored in lower case', async () => {
    const res = await putProfile({ ...valid, fullName: '  Ali   Raza  ', email: ' ALI@Test.PK ' });
    assert.equal(res.body.profile.fullName, 'Ali Raza');
    assert.equal(res.body.profile.email, 'ali@test.pk');
  });

  test('TC-03-07 after changing the email the tourist logs in with the new one', async () => {
    await putProfile(valid);
    const withNew = await app.request('POST', '/auth/login', { body: { email: valid.email, password: PASSWORD } });
    const withOld = await app.request('POST', '/auth/login', { body: { email: USERS.tourist.email, password: PASSWORD } });
    assert.equal(withNew.status, 200);
    assert.equal(withOld.status, 401);
  });

  test('TC-03-08 a Community Safety Observer manages a profile like a tourist (Table 20)', async () => {
    const observer = await app.loginAs(USERS.observer);
    const res = await app.request('GET', '/profile', { token: observer });
    assert.equal(res.status, 200);
    assert.equal(res.body.profile.role, 'community_safety_observer');
  });

  test('TC-03-09 withdrawing location consent stops check-in at once (FR-01.07)', async () => {
    await putProfile({ ...valid, locationConsent: false });
    const res = await app.request('POST', '/destinations/2/check-in', { token, body: { latitude: 36.32, longitude: 74.865 } });
    assert.equal(res.status, 403);
  });
});

describe('UC-03 alternative flow 4a - invalid information', () => {
  const invalid = [
    ['fullName', { fullName: 'A' }],
    ['fullName', { fullName: 'Ali <script>' }],
    ['fullName', { fullName: 'x'.repeat(101) }],
    ['email', { email: 'not-an-email' }],
    ['email', { email: USERS.observer.email }], // used by another account
    ['interests', { interests: ['Skiing'] }],
    ['interests', { interests: 'Nature' }],
    ['locationConsent', { locationConsent: 'yes' }],
  ];
  for (const [field, change] of invalid) {
    test(`TC-03-10 ${field} = ${JSON.stringify(Object.values(change)[0]).slice(0, 30)} is rejected and nothing changes`, async () => {
      const before = (await getProfile()).body.profile;
      const res = await putProfile({ ...valid, ...change });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Some information is invalid. Your previous values have been kept.');
      assert.ok(res.body.fields[field], `the ${field} field is pointed out`);
      assert.deepEqual((await getProfile()).body.profile, before);
    });
  }

  test('TC-03-11 every invalid field is reported together', async () => {
    const res = await putProfile({ fullName: '', email: '', interests: null });
    assert.deepEqual(Object.keys(res.body.fields).sort(), ['email', 'fullName', 'interests', 'locationConsent']);
  });

  test('TC-03-12 keeping the same email is not a duplicate', async () => {
    const res = await putProfile({ ...valid, email: USERS.tourist.email });
    assert.equal(res.status, 200);
  });
});

describe('UC-03 pre-condition - tourist is logged in', () => {
  test('TC-03-13 the profile cannot be read or changed without logging in', async () => {
    assert.equal((await app.request('GET', '/profile')).status, 401);
    assert.equal((await app.request('PUT', '/profile', { body: valid })).status, 401);
  });

  test('TC-03-14 a tourist only ever sees and changes their own profile', async () => {
    await putProfile(valid);
    const other = await app.loginAs(USERS.noConsent);
    const res = await app.request('GET', '/profile', { token: other });
    assert.equal(res.body.profile.email, USERS.noConsent.email);
    assert.deepEqual(res.body.profile.interests, ['Culture']);
  });
});
