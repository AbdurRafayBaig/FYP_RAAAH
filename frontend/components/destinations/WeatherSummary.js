"use client";

import { capitalise, timeAgo } from '@/lib/format';
import { useT } from '@/context/LanguageContext';

// FR-02.06 current weather; SRS 3.3.5 / UC-04 alt 5a last available weather with its update time
export default function WeatherSummary({ weather, compact = false }) {
  const t = useT();
  if (!weather) return <span className="meta">{t('No weather data yet')}</span>;

  const temp = `${Math.round(weather.temperature)}°C`;
  const condition = capitalise(weather.description || weather.condition);

  if (compact) {
    return (
      <span className="text-[13px] text-ink-2">
        <span className="data text-ink" dir="ltr">{temp}</span> {t(weather.condition)}
      </span>
    );
  }

  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-[26px] leading-none text-ink" dir="ltr">{temp}</span>
        <span className="text-[15px] text-ink-2">{t(condition)}</span>
      </p>
      <p className="meta mt-2">
        {weather.stale ? t('Last available reading, ') : t('Updated ')}
        <span dir="ltr">{timeAgo(weather.updatedAt)}</span>
      </p>
      {weather.unfavourable && <p className="mt-1 text-[13px] text-high">{t('Not good for travel.')}</p>}
    </div>
  );
}

// Next three days (FR-02.06); empty when the weather service has no forecast
export function ForecastStrip({ forecast }) {
  const t = useT();
  if (!forecast?.length) return null;
  const day = (date) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
  return (
    <ul className="mt-4 grid grid-cols-3 gap-2 border-t border-rule pt-3" aria-label={t('Next three days')}>
      {forecast.map((f) => (
        <li key={f.date} className="text-[12px]">
          <p className="text-muted" dir="ltr">{day(f.date)}</p>
          <p className="data text-ink" dir="ltr">{f.minTemperature}° / {f.maxTemperature}°</p>
          <p className={f.unfavourable ? 'text-high' : 'text-ink-2'}>{t(f.condition)}</p>
        </li>
      ))}
    </ul>
  );
}
