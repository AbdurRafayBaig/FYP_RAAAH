// Unit tests of safeNextPath (lib/safePath.js): the page to continue to after sign-in must stay on
// this site, otherwise a crafted link such as /login?next=//evil.example becomes an open redirect.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeNextPath } from '../../lib/safePath.js';

test('a path on this site is kept with its query and fragment', () => {
  assert.equal(safeNextPath('/profile'), '/profile');
  assert.equal(safeNextPath('/destinations/3?tab=weather#map'), '/destinations/3?tab=weather#map');
  assert.equal(safeNextPath('/'), '/');
});

test('dot segments are resolved, so the result is still a path on this site', () => {
  assert.equal(safeNextPath('/destinations/../profile'), '/profile');
  assert.equal(safeNextPath('/../../profile'), '/profile');
});

test('anything that is not a string is refused', () => {
  for (const value of [undefined, null, 42, {}, ['/profile']]) {
    assert.equal(safeNextPath(value), '', `accepted ${JSON.stringify(value)}`);
  }
});

test('relative paths and absolute addresses are refused', () => {
  for (const value of ['', 'profile', 'https://evil.example', 'javascript:alert(1)', 'mailto:a@b.c']) {
    assert.equal(safeNextPath(value), '', `accepted ${value}`);
  }
});

test('protocol-relative addresses to another site are refused', () => {
  assert.equal(safeNextPath('//evil.example'), '');
  assert.equal(safeNextPath('//evil.example/login'), '');
});

test('backslashes are refused because browsers read /\\evil like //evil', () => {
  assert.equal(safeNextPath('/\\evil.example'), '');
  assert.equal(safeNextPath('/profile\\..\\x'), '');
});

test('control characters are refused because browsers strip them from addresses', () => {
  assert.equal(safeNextPath('/\t/evil.example'), '');
  assert.equal(safeNextPath('/\n/evil.example'), '');
  assert.equal(safeNextPath('/profile\u0000'), '');
  assert.equal(safeNextPath('/profile\u007f'), '');
});
