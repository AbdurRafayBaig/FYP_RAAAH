// UC-02 Login (Expanded Use Case Table 39, SSD Fig. 21) - FR-01.03, SRS 3.3.3
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import jwt from 'jsonwebtoken';
import { getCache } from '../../src/data/cache.js';
import * as crowdService from '../../src/modules/crowd/crowdService.js';
import { PASSWORD, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
before(async () => { app = await startTestApp(); });
beforeEach(resetData);
after(() => app.close());

const login = (email, password) => app.request('POST', '/auth/login', { body: { email, password } });

describe('UC-02 normal flow', () => {
  for (const user of Object.values(USERS)) {
    test(`TC-02-01 ${user.role} logs in and the role is identified`, async () => {
      const res = await login(user.email, PASSWORD);
      assert.equal(res.status, 200);
      assert.ok(res.body.token);
      assert.equal(res.body.user.role, user.role);
      assert.equal(res.body.user.fullName, user.fullName);
      assert.equal('passwordHash' in res.body.user || 'password_hash' in res.body.user, false);
    });
  }

  test('TC-02-02 the email is not case sensitive and surrounding spaces are ignored', async () => {
    const res = await login('  TOURIST@Test.PK ', PASSWORD);
    assert.equal(res.status, 200);
    assert.equal(res.body.user.userId, USERS.tourist.id);
  });

  test('TC-02-03 the token gives access to the session of that user', async () => {
    const token = await app.loginAs(USERS.observer);
    const res = await app.request('GET', '/auth/me', { token });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, USERS.observer.email);
  });

  test('TC-02-04 tourists have a Tourist ID, staff accounts do not (FR-01.02)', async () => {
    const tourist = await login(USERS.tourist.email, PASSWORD);
    const admin = await login(USERS.admin.email, PASSWORD);
    assert.match(tourist.body.user.touristCode, /^RAH-\d{4}-\d{6}$/);
    assert.equal(admin.body.user.touristCode, null);
  });
});

describe('UC-02 alternative flow 4a - invalid credentials', () => {
  test('TC-02-05 a wrong password is rejected with an error', async () => {
    const res = await login(USERS.tourist.email, 'wrong-password');
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid email or password. Please try again.');
    assert.equal(res.body.token, undefined);
  });

  test('TC-02-06 an unknown email gets the same answer, so accounts cannot be discovered', async () => {
    const res = await login('nobody@test.pk', PASSWORD);
    assert.equal(res.status, 401);
    assert.equal(res.body.error, 'Invalid email or password. Please try again.');
  });

  test('TC-02-07 missing or malformed input is rejected before the database is asked', async () => {
    for (const body of [{}, { email: USERS.tourist.email }, { password: PASSWORD }, { email: 'not-an-email', password: PASSWORD }, { email: USERS.tourist.email, password: 12345 }]) {
      const res = await app.request('POST', '/auth/login', { body });
      assert.equal(res.status, 400, JSON.stringify(body));
    }
  });

  test('TC-02-08 a body that is not JSON is rejected', async () => {
    const res = await app.request('POST', '/auth/login', { body: '{not json' });
    assert.equal(res.status, 400);
  });

  test('TC-02-09 SQL in the email field does not log anyone in', async () => {
    const res = await login("' OR '1'='1' --@test.pk", PASSWORD);
    assert.ok([400, 401].includes(res.status));
  });
});

describe('UC-02 log out (FR-01.03)', () => {
  test('TC-02-10 after logging out the token no longer works', async () => {
    const token = await app.loginAs(USERS.tourist);
    const out = await app.request('POST', '/auth/logout', { token });
    assert.equal(out.status, 200);
    const res = await app.request('GET', '/auth/me', { token });
    assert.equal(res.status, 401);
  });

  test('TC-02-11 logging out one session leaves another session of the same user working', async () => {
    const first = await app.loginAs(USERS.tourist);
    const second = await app.loginAs(USERS.tourist);
    await app.request('POST', '/auth/logout', { token: first });
    assert.equal((await app.request('GET', '/auth/me', { token: second })).status, 200);
  });

  test('TC-02-18 a logout holds on another server instance that does not share the cache', async () => {
    const token = await app.loginAs(USERS.tourist);
    await app.request('POST', '/auth/logout', { token });
    // Another instance starts with an empty memory cache (Vercel Functions without Redis)
    getCache().store.clear();
    const res = await app.request('GET', '/auth/me', { token });
    assert.equal(res.status, 401);
    assert.match(res.body.error, /logged out/);
  });

  test('TC-02-19 logged-out sessions are removed from the database once they have expired', async () => {
    await app.db.query(
      `INSERT INTO revoked_tokens (jti, expires_at) VALUES ('old', NOW() - interval '1 minute'), ('current', NOW() + interval '1 hour')`,
    );
    await crowdService.runRefreshCycle();
    const { rows } = await app.db.query('SELECT jti FROM revoked_tokens');
    assert.deepEqual(rows.map((r) => r.jti), ['current']);
  });
});

describe('UC-02 protection against password guessing (SRS 3.3.3)', () => {
  const failTimes = async (n, email = USERS.tourist.email) => {
    for (let i = 0; i < n; i++) assert.equal((await login(email, `wrong-${i}`)).status, 401);
  };

  test('TC-02-20 after five failed attempts sign-in is paused, even with the right password', async () => {
    await failTimes(5);
    const res = await login(USERS.tourist.email, PASSWORD);
    assert.equal(res.status, 429);
    assert.match(res.body.error, /Too many failed sign-in attempts\. Please wait 15 minutes/);
    assert.ok(Number(res.headers.get('retry-after')) > 800);
    assert.equal(res.body.token, undefined);
  });

  test('TC-02-21 the pause applies to that email only, and ends after the lock period', async () => {
    await failTimes(5);
    assert.equal((await login(USERS.observer.email, PASSWORD)).status, 200);
    await app.db.query(`UPDATE login_failures SET failed_at = failed_at - interval '16 minutes'`);
    assert.equal((await login(USERS.tourist.email, PASSWORD)).status, 200);
  });

  test('TC-02-22 a successful sign-in clears the earlier failures', async () => {
    await failTimes(4);
    assert.equal((await login(USERS.tourist.email, PASSWORD)).status, 200);
    await failTimes(4);
    assert.equal((await login(USERS.tourist.email, PASSWORD)).status, 200);
  });

  test('TC-02-23 unknown emails are counted too, so accounts cannot be discovered by the pause', async () => {
    await failTimes(5, 'nobody@test.pk');
    assert.equal((await login('nobody@test.pk', PASSWORD)).status, 429);
  });
});

describe('UC-02 data security (SRS 3.3.3)', () => {
  test('TC-02-12 passwords are stored hashed, never in plain text', async () => {
    const { rows } = await app.db.query('SELECT password_hash FROM users WHERE email = $1', [USERS.tourist.email]);
    assert.match(rows[0].password_hash, /^\$2[aby]\$\d{2}\$/);
    assert.notEqual(rows[0].password_hash, PASSWORD);
  });

  test('TC-02-13 requests without a token, with a forged token or with an expired token are refused', async () => {
    assert.equal((await app.request('GET', '/auth/me')).status, 401);

    const forged = jwt.sign({ role: 'administrator' }, 'some-other-secret', { subject: '4', jwtid: 'x' });
    assert.equal((await app.request('GET', '/auth/me', { token: forged })).status, 401);

    const expired = jwt.sign({ role: 'tourist' }, 'raaah-test-secret', { subject: '1', jwtid: 'y', expiresIn: -10 });
    const res = await app.request('GET', '/auth/me', { token: expired });
    assert.equal(res.status, 401);
    assert.match(res.body.error, /expired/);
  });

  test('TC-02-14 the role is enforced on the server: staff cannot use tourist features', async () => {
    for (const user of [USERS.admin, USERS.authority]) {
      const token = await app.loginAs(user);
      assert.equal((await app.request('GET', '/profile', { token })).status, 403);
      assert.equal((await app.request('POST', '/recommendations', { token, body: {} })).status, 403);
      assert.equal((await app.request('POST', '/destinations/1/check-in', { token, body: {} })).status, 403);
    }
  });

  test('TC-02-15 a token of a deleted account is refused', async () => {
    const token = await app.loginAs(USERS.noConsent);
    await app.db.query('DELETE FROM users WHERE user_id = $1', [USERS.noConsent.id]);
    assert.equal((await app.request('GET', '/auth/me', { token })).status, 401);
  });

  test('TC-02-16 responses carry the security headers and are not cached', async () => {
    const res = await app.request('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.headers.get('x-powered-by'), null);
  });

  test('TC-02-24 the health check reports the AI engine, and stays ok while only the engine is down', async () => {
    const up = await app.request('GET', '/health');
    assert.equal(up.body.aiEngine, 'up');
    app.aiStub.mode = 'error';
    try {
      const down = await app.request('GET', '/health');
      assert.equal(down.status, 200);
      assert.equal(down.body.status, 'ok');
      assert.equal(down.body.aiEngine, 'down');
    } finally {
      app.aiStub.mode = 'rank';
    }
  });

  test('TC-02-17 only the configured web client addresses may call the API from a browser', async () => {
    const allowed = await app.request('GET', '/health', { headers: { Origin: 'http://localhost:3000' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    const other = await app.request('GET', '/health', { headers: { Origin: 'https://example.org' } });
    assert.equal(other.headers.get('access-control-allow-origin'), null);
  });
});
