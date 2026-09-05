// ==========================================
// CROWD BADGE COMPONENT
// Renders crowd density indicator (Low, Moderate, High, Critical)
// ==========================================

export default function CrowdBadge({ level, score, showScore = true, size = "md" }) {
  let bg = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let dotBg = "bg-emerald-500";
  let label = level || "Low";

  switch ((level || '').toLowerCase()) {
    case 'low':
      bg = "bg-emerald-50 text-emerald-800 border-emerald-300";
      dotBg = "bg-emerald-500";
      break;
    case 'moderate':
      bg = "bg-amber-50 text-amber-800 border-amber-300";
      dotBg = "bg-amber-500";
      break;
    case 'high':
      bg = "bg-orange-50 text-orange-800 border-orange-300";
      dotBg = "bg-orange-500";
      break;
    case 'critical':
    case 'overcrowded':
      bg = "bg-red-50 text-red-800 border-red-300";
      dotBg = "bg-red-500 animate-ping";
      break;
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : size === "lg" ? "px-3.5 py-1.5 text-sm font-semibold" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs ${bg} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2">
        <span className={`h-2 w-2 rounded-full ${dotBg}`}></span>
      </span>
      <span>{label} Density</span>
      {showScore && score !== undefined && (
        <span className="opacity-75 font-mono text-[11px]">({score}%)</span>
      )}
    </span>
  );
}
