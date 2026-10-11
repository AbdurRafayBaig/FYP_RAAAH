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

export async function getWeather(destinationList) {
  const stored = await weatherRepo.findByDestinations(destinationList.map((d) => d.destinationId));
  const result = new Map();

  await Promise.all(
    destinationList.map(async (d) => {
      let weather = stored.get(d.destinationId) || null;
      if (owm.isConfigured() && !isFresh(weather)) {
        try {
          const current = await owm.fetchCurrentWeather(d.location.latitude, d.location.longitude);
          weather = await weatherRepo.upsert(d.destinationId, current);
        } catch (err) {
          console.warn(`[weather] Using last available weather for ${d.name}: ${err.message}`);
        }
      }
      result.set(d.destinationId, present(weather));
    }),
  );
  return result;
}
