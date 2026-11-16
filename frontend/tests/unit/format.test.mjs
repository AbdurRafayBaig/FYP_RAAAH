// Unit tests of the display helpers shared by the tourist pages (lib/format.js).
import { afterEach, beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { capitalise, formatAltitude, formatTime, timeAgo } from '../../lib/format.js';

const NOW = new Date('2026-06-15T12:00:00Z').getTime();
const minutesAgo = (m) => new Date(NOW - m * 60_000);

beforeEach(() => mock.timers.enable({ apis: ['Date'], now: NOW }));
afterEach(() => mock.timers.reset());

test('timeAgo is empty without a date', () => {
  assert.equal(timeAgo(null), '');
  assert.equal(timeAgo(undefined), '');
  assert.equal(timeAgo(''), '');
});

test('timeAgo says "just now" for less than a minute', () => {
  assert.equal(timeAgo(new Date(NOW)), 'just now');
  assert.equal(timeAgo(new Date(NOW - 20_000)), 'just now');
});

test('timeAgo counts minutes below an hour', () => {
  assert.equal(timeAgo(minutesAgo(1)), '1 min ago');
  assert.equal(timeAgo(minutesAgo(59)), '59 min ago');
});

test('timeAgo counts hours below a day', () => {
  assert.equal(timeAgo(minutesAgo(60)), '1 h ago');
  assert.equal(timeAgo(minutesAgo(5 * 60)), '5 h ago');
});

test('timeAgo shows the date from a day onwards', () => {
  assert.equal(timeAgo(minutesAgo(3 * 24 * 60)), '12 Jun 2026');
});

test('timeAgo accepts the ISO strings returned by the API', () => {
  assert.equal(timeAgo(minutesAgo(10).toISOString()), '10 min ago');
});

test('formatTime shows day, month and time', () => {
  const text = formatTime(new Date(2026, 5, 15, 9, 5));
  assert.match(text, /^15 Jun(,| at)? 09:05$/);
});

test('formatAltitude adds thousands separators and the unit', () => {
  assert.equal(formatAltitude(2438), '2,438 m');
  assert.equal(formatAltitude(850), '850 m');
});

test('formatAltitude is empty when the altitude is unknown', () => {
  assert.equal(formatAltitude(null), '');
  assert.equal(formatAltitude(undefined), '');
  assert.equal(formatAltitude(0), '');
});

test('capitalise upper-cases only the first letter', () => {
  assert.equal(capitalise('light rain'), 'Light rain');
  assert.equal(capitalise('Clear'), 'Clear');
  assert.equal(capitalise(''), '');
  assert.equal(capitalise(), '');
});
