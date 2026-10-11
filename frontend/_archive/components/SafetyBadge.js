import { RISK_COLORS } from '@/constants/riskLevels';

export default function SafetyBadge({ status = 'Low Risk', icon = 'shield' }) {
  let normStatus = status || 'Low Risk';
  if (normStatus === 'Safe') normStatus = 'Low Risk';
  if (normStatus === 'Caution') normStatus = 'Elevated Risk';
  if (normStatus === 'Danger' || normStatus === 'Severe') normStatus = 'High Risk';

  const config = RISK_COLORS[normStatus] || RISK_COLORS['Low Risk'];

  return (
    <span 
      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md border text-xs font-semibold"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.text,
      }}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      <span>{normStatus}</span>
    </span>
  );
}
