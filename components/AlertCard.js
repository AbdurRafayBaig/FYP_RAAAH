// ==========================================
// ALERT CARD COMPONENT
// Travel Safety & Disaster Hazard Alert Card matching Stitch design
// ==========================================

export default function AlertCard({ alert }) {
  const {
    title,
    category,
    severity,
    region,
    timestamp,
    status,
    affectedRoutes,
    recommendedAction,
    authority,
    contactNumber,
    icon
  } = alert;

  let borderColor = "border-amber-300 bg-amber-50/40";
  let badgeBg = "bg-amber-100 text-amber-900 border-amber-300";

  if (severity.toLowerCase().includes("high")) {
    borderColor = "border-red-300 bg-red-50/40";
    badgeBg = "bg-red-100 text-red-900 border-red-300";
  } else if (severity.toLowerCase().includes("low")) {
    borderColor = "border-blue-300 bg-blue-50/40";
    badgeBg = "bg-blue-100 text-blue-900 border-blue-300";
  }

  return (
    <div className={`p-6 rounded-2xl border-2 ${borderColor} bg-white shadow-sm space-y-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badgeBg}`}>
            <span className="material-symbols-outlined text-xl">{icon || 'warning'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#575A60] uppercase tracking-wider">
              {category} • {region}
            </span>
            <h3 className="font-serif-editorial text-xl font-bold text-[#041627]">
              {title}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
            {severity}
          </span>
          <span className="block text-[11px] text-[#575A60] mt-1">{timestamp}</span>
        </div>
      </div>

      {/* Affected Routes & Status */}
      <div className="bg-[#FAF9F8] p-4 rounded-xl border border-[#E5E3DC] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Status:</span>
          <span className="font-bold text-amber-700">{status}</span>
        </div>
        <div className="flex items-start space-x-2 text-xs">
          <span className="font-semibold text-slate-700 shrink-0">Affected Corridors:</span>
          <div className="flex flex-wrap gap-1">
            {affectedRoutes.map((route, i) => (
              <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">
                {route}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Tourist Action */}
      <div className="text-xs text-slate-800 bg-amber-50/70 p-3 rounded-lg border border-amber-200/80 flex items-start space-x-2">
        <span className="material-symbols-outlined text-amber-700 text-base shrink-0">info</span>
        <div>
          <strong className="text-amber-900 block font-semibold mb-0.5">RAAAH Safety Guidance:</strong>
          <p className="leading-relaxed text-amber-950">{recommendedAction}</p>
        </div>
      </div>

      {/* Authority & Call Action */}
      <div className="pt-2 flex items-center justify-between border-t border-[#F0EEE9] text-xs text-slate-600">
        <span>Issued by: <strong>{authority}</strong></span>
        <a
          href={`tel:${contactNumber}`}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          <span>Call Helpline ({contactNumber})</span>
        </a>
      </div>
    </div>
  );
}
