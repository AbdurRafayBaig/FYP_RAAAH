import { config } from '../../config.js';
import * as weatherRepo from '../../data/repositories/weatherRepository.js';
import * as owm from '../../integrations/openWeatherMapClient.js';

// OpenWeatherMap condition codes: https://openweathermap.org/weather-conditions
// Thunderstorms, heavy rain, heavy snow and extreme phenomena are unfavourable for travel.
const UNFAVOURABLE_CODES = new Set([
  200, 201, 202, 210, 211, 212, 221, 230, 231, 232,
  502, 503, 504, 511, 522, 531,
  602, 611, 612, 613, 616, 621, 622,
  711, 731, 751, 761, 762, 771, 781,
]);

export function isUnfavourable(weather) {
  if (!weather) return null;
  if (weather.weatherCode && UNFAVOURABLE_CODES.has(weather.weatherCode)) return true;
  return weather.temperature <= -15 || weather.temperature >= 42;
}

const isFresh = (weather) =>
  weather && Date.now() - new Date(weather.updatedAt).getTime() < config.weatherRefreshMinutes * 60 * 1000;

function present(weather) {
  if (!weather) return null;
  return {
    ...weather,
    // SRS 3.3.5 / UC-04 alt 5a: last available data is shown with its update time
    stale: !isFresh(weather),
    unfavourable: isUnfavourable(weather),
  };
}

// Asks OpenWeatherMap for the destinations whose stored weather is older than `olderThanSeconds`.
// Only the instance that claims a row asks (weatherRepository.claimForRefresh); the others, and the
// next minute after a failed call, keep the last available weather (SRS 3.3.5).
async function renew(destinationList, stored, olderThanSeconds) {
  const withRow = destinationList.filter((d) => stored.has(d.destinationId));
  const claimed = withRow.length
    ? await weatherRepo.claimForRefresh(withRow.map((d) => d.destinationId), olderThanSeconds)
    : new Set();
  const due = destinationList.filter((d) => !stored.has(d.destinationId) || claimed.has(d.destinationId));

  const renewed = new Map();
  await Promise.all(
    due.map(async (d) => {
      try {
        const current = await owm.fetchCurrentWeather(d.location.latitude, d.location.longitude);
        renewed.set(d.destinationId, await weatherRepo.upsert(d.destinationId, current));
      } catch (err) {
        console.warn(`[weather] Using last available weather for ${d.name}: ${err.message}`);
      }
    }),
  );
  return renewed;
}

// UC-04 step 5 - current weather; alt 5a - the last available weather with its update time
export async function getWeather(destinationList) {
  const stored = await weatherRepo.findByDestinations(destinationList.map((d) => d.destinationId));
  if (owm.isConfigured()) {
    const stale = destinationList.filter((d) => !isFresh(stored.get(d.destinationId)));
    if (stale.length > 0) {
      const renewed = await renew(stale, stored, config.weatherRefreshMinutes * 60);
      for (const [id, weather] of renewed) stored.set(id, weather);
    }
  }
  return new Map(destinationList.map((d) => [d.destinationId, present(stored.get(d.destinationId) || null)]));
}

// Refresh cycle: weather is renewed two minutes before it would turn stale, so requests find it fresh
const AHEAD_SECONDS = 120;

export async function refreshWeatherAhead(destinationList) {
  if (!owm.isConfigured() || destinationList.length === 0) return 0;
  const stored = await weatherRepo.findByDestinations(destinationList.map((d) => d.destinationId));
  const olderThan = Math.max(60, config.weatherRefreshMinutes * 60 - AHEAD_SECONDS);
  return (await renew(destinationList, stored, olderThan)).size;
}
