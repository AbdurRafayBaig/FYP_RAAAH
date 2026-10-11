// Database Models (Package Diagram, Data Access Layer) - weather_info (WeatherInfo, Domain Model Fig. 46)

export function toWeather(row) {
  return {
    temperature: Number(row.temperature),
    condition: row.condition,
    description: row.description,
    weatherCode: row.weather_code,
    icon: row.icon,
    updatedAt: row.updated_at,
  };
}
