// UC-01 Register Account (Expanded Use Case Table 38, SSD Fig. 20) - FR-01.01, FR-01.02, FR-01.04
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
before(async () => { app = await startTestApp(); });
beforeEach(resetData);
after(() => app.close());

const NEW_TOURIST = {
  fullName: '  Hina   Shah ',
  email: 'Hina.Shah@Test.PK',
  password: 'Travel2026',
  confirmPassword: 'Travel2026',
  interests: ['Nature', 'Culture'],
};

const register = (body) => app.request('POST', '/auth/register', { body });

describe('UC-01 normal flow', () => {
  test('TC-01-01 a new tourist is created with a unique Tourist ID and signed in', async () => {
    const res = await register(NEW_TOURIST);
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'tourist');
    assert.equal(res.body.user.fullName, 'Hina Shah');
    assert.equal(res.body.user.email, 'hina.shah@test.pk');
    assert.deepEqual(res.body.user.interests, ['Nature', 'Culture']);
    assert.equal(res.body.user.locationConsent, false);
    assert.match(res.body.user.touristCode, /^RAH-\d{4}-\d{6}$/);
    assert.match(res.body.message, new RegExp(res.body.user.touristCode));

    const me = await app.request('GET', '/auth/me', { token: res.body.token });
    assert.equal(me.status, 200);
    assert.equal(me.body.user.userId, res.body.user.userId);
  });

  test('TC-01-02 the new account can log in with its password, which is stored hashed', async () => {
    await register(NEW_TOURIST);
    const login = await app.request('POST', '/auth/login', { body: { email: 'hina.shah@test.pk', password: 'Travel2026' } });
    assert.equal(login.status, 200);
    const { rows } = await app.db.query('SELECT password_hash FROM users WHERE email = $1', ['hina.shah@test.pk']);
    assert.match(rows[0].password_hash, /^\$2[aby]\$\d{2}\$/);
  });

  test('TC-01-03 two tourists get different Tourist IDs', async () => {
    const a = await register(NEW_TOURIST);
    const b = await register({ ...NEW_TOURIST, email: 'second@test.pk' });
    assert.notEqual(a.body.user.touristCode, b.body.user.touristCode);
  });

  test('TC-01-08 travel preferences may be left for after the first sign-in', async () => {
    const { interests, ...withoutInterests } = NEW_TOURIST;
    const res = await register(withoutInterests);
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.user.interests, []);
  });

  test('TC-01-04 a role sent by the client is ignored: registration only creates tourists', async () => {
    const res = await register({ ...NEW_TOURIST, role: 'administrator' });
    assert.equal(res.status, 201);
    assert.equal(res.body.user.role, 'tourist');
  });
});

describe('UC-01 alternative flow 4a - email already registered', () => {
  test('TC-01-05 an existing email is refused and the tourist is asked to sign in', async () => {
    const res = await register({ ...NEW_TOURIST, email: ` ${USERS.tourist.email.toUpperCase()} ` });
    assert.equal(res.status, 409);
    assert.match(res.body.error, /already registered/);
    assert.ok(res.body.fields.email);
    const { rows } = await app.db.query('SELECT COUNT(*)::int AS n FROM users WHERE email = $1', [USERS.tourist.email]);
    assert.equal(rows[0].n, 1);
  });
});

describe('UC-01 alternative flow 4b - missing or invalid information', () => {
  const cases = [
    ['fullName', { fullName: '' }],
    ['fullName', { fullName: '1234' }],
    ['email', { email: 'not-an-email' }],
    ['password', { password: 'short1', confirmPassword: 'short1' }],
    ['password', { password: 'onlyletters', confirmPassword: 'onlyletters' }],
    ['password', { password: '12345678', confirmPassword: '12345678' }],
    ['confirmPassword', { confirmPassword: 'Different1' }],
    ['interests', { interests: ['Shopping'] }],
  ];
  for (const [field, change] of cases) {
    test(`TC-01-06 ${field} ${JSON.stringify(change)} is highlighted and nothing is saved`, async () => {
      const res = await register({ ...NEW_TOURIST, ...change });
      assert.equal(res.status, 400);
      assert.ok(res.body.fields[field], JSON.stringify(res.body));
      const { rows } = await app.db.query("SELECT COUNT(*)::int AS n FROM users WHERE email = 'hina.shah@test.pk'");
      assert.equal(rows[0].n, 0);
    });
  }

  test('TC-01-07 an empty request reports every required field', async () => {
    const res = await register({});
    assert.equal(res.status, 400);
    for (const field of ['fullName', 'email', 'password']) assert.ok(res.body.fields[field], field);
  });
});
