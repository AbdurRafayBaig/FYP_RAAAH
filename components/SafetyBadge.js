// ==========================================
// SAFETY BADGE COMPONENT
// Renders safety status (Low Risk, Elevated Risk, High Risk)
// ==========================================

export default function SafetyBadge({ status, icon = "shield" }) {
  let bg = "bg-emerald-50 text-emerald-800 border-emerald-300";

  switch ((status || '').toLowerCase()) {
    case 'low risk':
    case 'safe':
      bg = "bg-emerald-50 text-emerald-800 border-emerald-300";
      break;
    case 'elevated risk':
    case 'caution':
      bg = "bg-amber-50 text-amber-900 border-amber-300";
      break;
    case 'high risk':
    case 'danger':
    case 'severe':
      bg = "bg-red-50 text-red-800 border-red-300";
      break;
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md border text-xs font-semibold ${bg}`}>
      <span className="material-symbols-outlined text-sm">{icon}</span>
      <span>{status || 'Low Risk'}</span>
    </span>
  );
}
