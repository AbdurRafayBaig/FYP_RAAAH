import { CROWD_COLORS, CROWD_LEVELS } from '@/constants/crowdLevels';

// Four rising bars, filled up to the current level (Low = 1 ... Critical = 4)
export default function CrowdLevel({ level = 'Low', size = 'sm', showLabel = true, className = '' }) {
  const index = Math.max(0, CROWD_LEVELS.indexOf(level));
  const color = CROWD_COLORS[level] || CROWD_COLORS.Low;
  const large = size === 'md';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title={`${level} crowd`}>
      <span className="inline-flex items-end gap-[2px]" aria-hidden="true">
        {CROWD_LEVELS.map((l, i) => (
          <span
            key={l}
            className="rounded-[1px]"
            style={{
              width: large ? 5 : 4,
              height: (large ? 7 : 5) + i * (large ? 4 : 3),
              backgroundColor: i <= index ? color : '#d6d0c2',
            }}
          />
        ))}
      </span>
      {showLabel && (
        <span className={large ? 'text-[16px] text-ink' : 'text-[13px] text-ink-2'}>{level} crowd</span>
      )}
    </span>
  );
}
