import { config } from '../config.js';

// OpenWeatherMap Client (Package Diagram, External Service Integrations) - FR-02.06
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
