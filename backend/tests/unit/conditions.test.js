import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { assessConditions, matchPreferences } from '../../src/modules/destinations/conditions.js';
import { isUnfavourable } from '../../src/modules/destinations/weatherService.js';
import { isValidEmail, normaliseEmail } from '../../src/modules/auth/authService.js';

const fine = { crowdLevel: 'Low', riskStatus: 'Low Risk', weather: { unfavourable: false }, accessInfo: { status: 'Open' }, hazards: [] };

// FR-05.01 / FR-05.02 - when does a destination need alternatives? (UC-04 alt 6a, UC-09 trigger)
describe('assessConditions', () => {
  test('a quiet, safe, open destination with good weather needs no alternatives', () => {
    const result = assessConditions(fine);
    assert.equal(result.needsAlternatives, false);
    assert.deepEqual(result.reasons, []);
  });

  test('Moderate crowd is not treated as crowded', () => {
    assert.equal(assessConditions({ ...fine, crowdLevel: 'Moderate' }).needsAlternatives, false);
  });

  for (const level of ['High', 'Critical']) {
    test(`${level} crowd is crowded`, () => {
      const result = assessConditions({ ...fine, crowdLevel: level });
      assert.equal(result.crowded, true);
      assert.equal(result.needsAlternatives, true);
      assert.deepEqual(result.reasons, [`Crowd level is ${level}.`]);
    });
  }

  for (const status of ['Elevated Risk', 'High Risk']) {
    test(`${status} is unsafe`, () => {
      const result = assessConditions({ ...fine, riskStatus: status });
      assert.equal(result.unsafe, true);
      assert.equal(result.needsAlternatives, true);
    });
  }

  test('a verified hazard makes the destination unsafe and is named once per type', () => {
    const hazards = [{ hazardType: 'Landslide' }, { hazardType: 'Landslide' }, { hazardType: 'Rockfall' }];
    const result = assessConditions({ ...fine, hazards });
    assert.equal(result.unsafe, true);
    assert.deepEqual(result.reasons, ['3 verified hazard report(s): Landslide, Rockfall.']);
  });

  test('closed access is inaccessible; limited access is only mentioned', () => {
    const closed = assessConditions({ ...fine, accessInfo: { status: 'Closed' } });
    assert.equal(closed.inaccessible, true);
    assert.equal(closed.needsAlternatives, true);

    const limited = assessConditions({ ...fine, accessInfo: { status: 'Limited' } });
    assert.equal(limited.inaccessible, false);
    assert.equal(limited.needsAlternatives, false);
    assert.deepEqual(limited.reasons, ['Access to the destination is limited.']);
  });

  test('unfavourable weather needs alternatives; unknown weather does not', () => {
    const storm = assessConditions({ ...fine, weather: { unfavourable: true, description: 'thunderstorm' } });
    assert.equal(storm.unfavourableWeather, true);
    assert.equal(storm.needsAlternatives, true);
    assert.equal(assessConditions({ ...fine, weather: null }).needsAlternatives, false);
  });

  test('every problem is listed when several apply', () => {
    const result = assessConditions({
      crowdLevel: 'Critical', riskStatus: 'High Risk', weather: { unfavourable: true, condition: 'Snow' },
      accessInfo: { status: 'Closed' }, hazards: [{ hazardType: 'Flash Flood' }],
    });
    assert.equal(result.reasons.length, 5);
  });
});

describe('matchPreferences (FR-05.01)', () => {
  test('returns the destination characteristics the tourist prefers', () => {
    assert.deepEqual(matchPreferences(['Nature', 'Photography'], ['Culture', 'Photography', 'Nature']), ['Photography', 'Nature']);
  });

  test('no preferences, no match', () => {
    assert.deepEqual(matchPreferences(undefined, ['Nature']), []);
    assert.deepEqual(matchPreferences([], ['Nature']), []);
  });
});

describe('isUnfavourable weather', () => {
  test('clear, cloudy and light rain are fine', () => {
    for (const weatherCode of [800, 801, 500, 600]) assert.equal(isUnfavourable({ weatherCode, temperature: 15 }), false);
  });

  test('thunderstorm, heavy rain, heavy snow and extreme phenomena are unfavourable', () => {
    for (const weatherCode of [200, 211, 502, 602, 781]) assert.equal(isUnfavourable({ weatherCode, temperature: 15 }), true);
  });

  test('extreme temperatures are unfavourable whatever the sky looks like', () => {
    assert.equal(isUnfavourable({ weatherCode: 800, temperature: -15 }), true);
    assert.equal(isUnfavourable({ weatherCode: 800, temperature: 42 }), true);
  });

  test('unknown weather is reported as unknown, not as good', () => {
    assert.equal(isUnfavourable(null), null);
  });
});

describe('email handling', () => {
  test('emails are trimmed and compared in lower case', () => {
    assert.equal(normaliseEmail('  Tourist@RAAAH.pk '), 'tourist@raaah.pk');
    assert.equal(normaliseEmail(undefined), '');
  });

  test('validation', () => {
    assert.equal(isValidEmail('tourist@raaah.pk'), true);
    for (const bad of ['', 'tourist', 'tourist@', '@raaah.pk', 'a b@raaah.pk', 'tourist@raaah']) {
      assert.equal(isValidEmail(bad), false, bad);
    }
    assert.equal(isValidEmail(`${'a'.repeat(250)}@raaah.pk`), false);
  });
});
