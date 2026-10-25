import { config } from '../config.js';

// OpenWeatherMap Client (Package Diagram, External Service Integrations) - FR-02.06
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
// Pakistan Standard Time, used to group the 3-hour forecast into days
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;
const FORECAST_DAYS = 3;

export function isConfigured() {
  return Boolean(config.openWeatherApiKey);
}

export async function fetchCurrentWeather(latitude, longitude) {
  const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${config.openWeatherApiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`OpenWeatherMap responded with ${res.status}`);
  const body = await res.json();
  const w = body.weather?.[0] || {};
  return {
    temperature: Math.round(body.main.temp * 10) / 10,
    condition: w.main || 'Unknown',
    description: w.description || null,
    weatherCode: w.id ?? null,
    icon: w.icon || null,
  };
}

// The free 5-day / 3-hour forecast, summarised per day for the next days after today:
// lowest and highest temperature, and the conditions closest to midday
export function summariseForecast(list, now = Date.now()) {
  const today = new Date(now + PKT_OFFSET_MS).toISOString().slice(0, 10);
  const days = new Map();
  for (const item of list) {
    const local = new Date(item.dt * 1000 + PKT_OFFSET_MS);
    const date = local.toISOString().slice(0, 10);
    if (date <= today) continue;
    const day = days.get(date) || { date, min: Infinity, max: -Infinity, midday: null, distance: Infinity };
    day.min = Math.min(day.min, item.main.temp_min ?? item.main.temp);
    day.max = Math.max(day.max, item.main.temp_max ?? item.main.temp);
    const distance = Math.abs(local.getUTCHours() - 12);
    if (distance < day.distance) Object.assign(day, { midday: item.weather?.[0] || {}, distance });
    days.set(date, day);
  }
  return [...days.values()].slice(0, FORECAST_DAYS).map((d) => ({
    date: d.date,
    minTemperature: Math.round(d.min),
    maxTemperature: Math.round(d.max),
    condition: d.midday.main || 'Unknown',
    description: d.midday.description || null,
    weatherCode: d.midday.id ?? null,
    icon: d.midday.icon || null,
  }));
}

export async function fetchForecast(latitude, longitude) {
  const url = `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${config.openWeatherApiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`OpenWeatherMap responded with ${res.status}`);
  const body = await res.json();
  return summariseForecast(body.list || []);
}
