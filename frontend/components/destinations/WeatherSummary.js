import { capitalise, timeAgo } from '@/lib/format';

// FR-02.06 current weather; SRS 3.3.5 / UC-04 alt 5a last available weather with its update time
export default function WeatherSummary({ weather, compact = false }) {
  if (!weather) return <span className="meta">No weather data yet</span>;

  const temp = `${Math.round(weather.temperature)}°`;
  const condition = capitalise(weather.description || weather.condition);

  if (compact) {
    return (
      <span className="text-[13px] text-ink-2">
        <span className="data text-ink">{temp}</span> {weather.condition}
      </span>
    );
  }

  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-[26px] leading-none text-ink">{temp}C</span>
        <span className="text-[15px] text-ink-2">{condition}</span>
      </p>
      <p className="meta mt-2">
        {weather.stale ? 'Last available reading, ' : 'Updated '}
        {timeAgo(weather.updatedAt)}
      </p>
      {weather.unfavourable && <p className="mt-1 text-[13px] text-high">Not good for travel.</p>}
    </div>
  );
}
