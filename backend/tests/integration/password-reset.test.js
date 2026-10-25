// SRS 3.3.3 - password reset by email (forgot password)
import assert from 'node:assert/strict';
import { after, afterEach, before, beforeEach, describe, test } from 'node:test';
import { setTransport } from '../../src/integrations/emailClient.js';
import { PASSWORD, USERS, resetData, startTestApp } from '../helpers/testApp.js';

let app;
let sent;
before(async () => { app = await startTestApp(); });
beforeEach(async () => {
  await resetData();
  sent = [];
  setTransport(async (message) => { sent.push(message); return true; });
});
afterEach(() => setTransport(null));
after(() => app.close());

const NEW_PASSWORD = 'Mountain2026';
const forgot = (email) => app.request('POST', '/auth/forgot-password', { body: { email } });
const reset = (token, password = NEW_PASSWORD, confirmPassword = password) =>
  app.request('POST', '/auth/reset-password', { body: { token, password, confirmPassword } });
const login = (password) => app.request('POST', '/auth/login', { body: { email: USERS.tourist.email, password } });
const tokenFrom = (message) => message.text.match(/reset-password\?token=([\w-]+)/)[1];

describe('Forgot password', () => {
  test('TC-02-25 a link is emailed to the account, and the new password works once', async () => {
    const res = await forgot(` ${USERS.tourist.email.toUpperCase()} `);
    assert.equal(res.status, 200);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, USERS.tourist.email);
    assert.match(sent[0].text, /http:\/\/localhost:3000\/reset-password\?token=/);

    const token = tokenFrom(sent[0]);
    const done = await reset(token);
    assert.equal(done.status, 200);
    assert.equal((await login(NEW_PASSWORD)).status, 200);
    assert.equal((await login(PASSWORD)).status, 401);
    // The same link cannot be used again
    assert.equal((await reset(token, 'Another2026')).status, 400);
  });

  test('TC-02-26 an unknown email gets the same answer and no email is sent', async () => {
    const known = await forgot(USERS.tourist.email);
    const unknown = await forgot('nobody@test.pk');
    assert.equal(unknown.status, 200);
    assert.equal(unknown.body.message, known.body.message);
    assert.equal(sent.length, 1);
  });

  test('TC-02-27 only a hash of the token is stored', async () => {
    await forgot(USERS.tourist.email);
    const token = tokenFrom(sent[0]);
    const { rows } = await app.db.query('SELECT token_hash FROM password_resets');
    assert.equal(rows.length, 1);
    assert.notEqual(rows[0].token_hash, token);
    assert.match(rows[0].token_hash, /^[0-9a-f]{64}$/);
  });

  test('TC-02-28 an expired link, an older link and a made-up link are refused', async () => {
    await forgot(USERS.tourist.email);
    const first = tokenFrom(sent[0]);
    await forgot(USERS.tourist.email);
    const second = tokenFrom(sent[1]);
    assert.equal((await reset(first)).status, 400, 'a newer link replaces the older one');

    await app.db.query("UPDATE password_resets SET expires_at = NOW() - interval '1 minute'");
    assert.equal((await reset(second)).status, 400, 'expired');
    assert.equal((await reset('x'.repeat(43))).status, 400, 'made up');
    assert.equal((await login(PASSWORD)).status, 200, 'the password stays as it was');
  });

  test('TC-02-29 the new password must follow the password rule', async () => {
    await forgot(USERS.tourist.email);
    const token = tokenFrom(sent[0]);
    const weak = await reset(token, 'short1');
    assert.equal(weak.status, 400);
    assert.ok(weak.body.fields.password);
    const mismatch = await reset(token, NEW_PASSWORD, 'Different2026');
    assert.ok(mismatch.body.fields.confirmPassword);
    // The link was not used up by the refused attempts
    assert.equal((await reset(token)).status, 200);
  });

  test('TC-02-30 sessions signed in before the reset end', async () => {
    const before = (await login(PASSWORD)).body.token;
    assert.equal((await app.request('GET', '/auth/me', { token: before })).status, 200);
    // JWT times are in whole seconds
    await new Promise((r) => setTimeout(r, 1100));
    await forgot(USERS.tourist.email);
    await reset(tokenFrom(sent[0]));

    const old = await app.request('GET', '/auth/me', { token: before });
    assert.equal(old.status, 401);
    assert.match(old.body.error, /password has been changed/);
    const fresh = (await login(NEW_PASSWORD)).body.token;
    assert.equal((await app.request('GET', '/auth/me', { token: fresh })).status, 200);
  });

  test('TC-02-31 at most three links an hour are sent for one account', async () => {
    for (let i = 0; i < 5; i += 1) assert.equal((await forgot(USERS.tourist.email)).status, 200);
    assert.equal(sent.length, 3);
  });

  test('TC-02-32 a reset opens sign-in again after too many failed attempts', async () => {
    for (let i = 0; i < 5; i += 1) await login('Wrong12345');
    assert.equal((await login(PASSWORD)).status, 429);
    await forgot(USERS.tourist.email);
    await reset(tokenFrom(sent[0]));
    assert.equal((await login(NEW_PASSWORD)).status, 200);
  });

  test('TC-02-33 an invalid email is refused', async () => {
    const res = await forgot('not-an-email');
    assert.equal(res.status, 400);
    assert.ok(res.body.fields.email);
  });
});
