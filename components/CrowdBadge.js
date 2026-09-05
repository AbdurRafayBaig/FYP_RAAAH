import { CROWD_COLORS } from '@/constants/crowdLevels';

export default function CrowdBadge({ level = 'Low', size = 'md' }) {
  const normLevel = (level || 'Low').trim();
  const config = CROWD_COLORS[normLevel] || CROWD_COLORS['Low'];

  const sizeClasses = 
    size === 'sm' 
      ? 'px-2.5 py-0.5 text-xs font-semibold' 
      : size === 'lg' 
      ? 'px-3.5 py-1.5 text-sm font-bold' 
      : 'px-3 py-1 text-xs font-bold';

  let dotColor = '#2E7D5B';
  if (normLevel === 'Moderate') dotColor = '#C68A19';
  if (normLevel === 'High') dotColor = '#D65A4A';
  if (normLevel === 'Critical') dotColor = '#A83232';

  return (
    <span 
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs ${sizeClasses}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.text,
      }}
    >
      <span 
        className="h-2 w-2 rounded-full shrink-0" 
        style={{ backgroundColor: dotColor }}
      />
      <span>{normLevel} Crowd</span>
    </span>
  );
}
