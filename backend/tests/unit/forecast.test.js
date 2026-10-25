// FR-02.06 - the 3-hour OpenWeatherMap forecast summarised per day
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { summariseForecast } from '../../src/integrations/openWeatherMapClient.js';

// 25 October 2026, 10:00 in Pakistan (05:00 UTC)
const NOW = Date.UTC(2026, 9, 25, 5, 0);
const at = (day, utcHour, temp, id = 800, main = 'Clear') => ({
  dt: Date.UTC(2026, 9, day, utcHour) / 1000,
  main: { temp, temp_min: temp, temp_max: temp },
  weather: [{ id, main, description: main.toLowerCase(), icon: '01d' }],
});

describe('summariseForecast', () => {
  test('today is left out and the next three days are kept', () => {
    const list = [25, 26, 27, 28, 29].flatMap((day) => [at(day, 1, 5), at(day, 7, 12)]);
    assert.deepEqual(summariseForecast(list, NOW).map((d) => d.date), ['2026-10-26', '2026-10-27', '2026-10-28']);
  });

  test('each day has its lowest and highest temperature', () => {
    const [day] = summariseForecast([at(26, 1, 3.4), at(26, 7, 14.6), at(26, 16, 8)], NOW);
    assert.equal(day.minTemperature, 3);
    assert.equal(day.maxTemperature, 15);
  });

  test('the conditions closest to midday describe the day', () => {
    // 07:00 UTC is 12:00 in Pakistan
    const [day] = summariseForecast([at(26, 1, 3, 600, 'Snow'), at(26, 7, 10, 500, 'Rain'), at(26, 13, 6, 800, 'Clear')], NOW);
    assert.equal(day.condition, 'Rain');
    assert.equal(day.weatherCode, 500);
  });

  test('days are grouped in Pakistan time, not UTC', () => {
    // 20:00 UTC on the 26th is 01:00 on the 27th in Pakistan
    const days = summariseForecast([at(26, 7, 10), at(26, 20, 2)], NOW);
    assert.deepEqual(days.map((d) => d.date), ['2026-10-26', '2026-10-27']);
  });

  test('an empty forecast gives no days', () => {
    assert.deepEqual(summariseForecast([], NOW), []);
  });
});
