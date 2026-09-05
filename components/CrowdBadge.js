// ==========================================
// CROWD BADGE COMPONENT
// Clear, high-contrast density indicator
// ==========================================

export default function CrowdBadge({ level, score, showScore = true, size = "md" }) {
  let bg = "bg-emerald-50 text-emerald-800 border-emerald-300";
  let dotBg = "bg-emerald-600";
  let label = level || "Low";

  switch ((level || '').toLowerCase()) {
    case 'low':
      bg = "bg-emerald-50 text-emerald-800 border-emerald-300";
      dotBg = "bg-emerald-600";
      break;
    case 'moderate':
      bg = "bg-amber-50 text-amber-900 border-amber-300";
      dotBg = "bg-amber-600";
      break;
    case 'high':
      bg = "bg-orange-50 text-orange-900 border-orange-300";
      dotBg = "bg-orange-600";
      break;
    case 'critical':
    case 'overcrowded':
      bg = "bg-red-50 text-red-900 border-red-300";
      dotBg = "bg-red-600 animate-ping";
      break;
  }

  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs font-semibold" : size === "lg" ? "px-3.5 py-1.5 text-sm font-bold" : "px-3 py-1 text-xs font-bold";

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs ${bg} ${sizeClasses}`}>
      <span className={`h-2 w-2 rounded-full ${dotBg}`}></span>
      <span>{label} Crowd</span>
      {showScore && score !== undefined && (
        <span className="font-mono text-[11px] opacity-80">({score}%)</span>
      )}
    </span>
  );
}
