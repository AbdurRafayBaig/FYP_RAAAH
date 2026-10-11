import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { CROWD_LEVELS, HAZARD_TYPES, INTERESTS, RISK_STATUSES, ROLES, TOURIST_ROLES, classifyCrowd } from '../../src/domain.js';

// FR-03.05 / Table 11 - crowd level classification
describe('classifyCrowd (Table 11)', () => {
  const cases = [
    [0, 100, 'Low'],
    [59, 100, 'Low'], // within the normal capacity range
    [60, 100, 'Moderate'], // approaching the configured capacity
    [99, 100, 'Moderate'],
    [100, 100, 'High'], // reached the configured threshold
    [120, 100, 'High'],
    [121, 100, 'Critical'], // exceeded the capacity limit
    [500, 100, 'Critical'],
    [3, 5, 'Moderate'],
    [7, 5, 'Critical'],
  ];
  for (const [visitors, capacity, expected] of cases) {
    test(`${visitors} visitors at capacity ${capacity} is ${expected}`, () => {
      assert.equal(classifyCrowd(visitors, capacity), expected);
    });
  }

  test('a destination without a capacity threshold is never reported as crowded', () => {
    assert.equal(classifyCrowd(50, 0), 'Low');
  });

  test('only the four SRS levels are produced', () => {
    for (let visitors = 0; visitors <= 200; visitors += 1) {
      assert.ok(CROWD_LEVELS.includes(classifyCrowd(visitors, 100)));
    }
  });
});

describe('domain constants', () => {
  test('roles of FR-01.03', () => {
    assert.deepEqual(Object.values(ROLES).sort(), ['administrator', 'community_safety_observer', 'tourism_authority', 'tourist']);
  });

  test('a Community Safety Observer can perform all Tourist use cases (Table 20)', () => {
    assert.deepEqual(TOURIST_ROLES, [ROLES.TOURIST, ROLES.OBSERVER]);
  });

  test('travel preferences of FR-01.04', () => {
    assert.deepEqual(INTERESTS, ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography']);
  });

  test('risk statuses of FR-06.01 and hazard types of FR-06.02', () => {
    assert.deepEqual(RISK_STATUSES, ['Low Risk', 'Elevated Risk', 'High Risk']);
    assert.equal(HAZARD_TYPES.length, 6);
  });
});
