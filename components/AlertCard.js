// ==========================================
// ALERT CARD COMPONENT
// Clean, trustworthy safety alert card (Section 9)
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

  let borderColor = 'border-[#F4DFB4]';
  let badgeBg = '#FEF8EC';
  let badgeText = '#C68A19';
  let badgeBorder = '#F4DFB4';

  if (severity.toLowerCase().includes('high')) {
    borderColor = 'border-[#F6C4BD]';
    badgeBg = '#FDF2F0';
    badgeText = '#D65A4A';
    badgeBorder = '#F6C4BD';
  } else if (severity.toLowerCase().includes('low')) {
    borderColor = 'border-[#B6E0CF]';
    badgeBg = '#EBF5F0';
    badgeText = '#2E7D5B';
    badgeBorder = '#B6E0CF';
  }

  return (
    <div className={`p-5 rounded-xl border ${borderColor} bg-white shadow-2xs space-y-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: badgeBg, color: badgeText }}
          >
            <span className="material-symbols-outlined text-lg">{icon || 'warning'}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#66736F] uppercase tracking-wider">
              {category} · {region}
            </span>
            <h3 className="text-base font-bold text-[#17211F]">
              {title}
            </h3>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span 
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border"
            style={{ backgroundColor: badgeBg, color: badgeText, borderColor: badgeBorder }}
          >
            {severity}
          </span>
          <span className="block text-[11px] text-[#66736F] mt-1">{timestamp}</span>
        </div>
      </div>

      {/* Status & Affected Routes */}
      <div className="bg-[#F7F8F5] p-3 rounded-lg border border-stone-200 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#66736F]">Status:</span>
          <span className="font-bold" style={{ color: badgeText }}>{status}</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="font-semibold text-[#66736F] shrink-0">Affected Routes:</span>
          <div className="flex flex-wrap gap-1">
            {affectedRoutes.map((route, i) => (
              <span key={i} className="bg-white px-2 py-0.5 rounded border border-stone-200 text-[#17211F] text-[11px]">
                {route}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Travel Guidance */}
      <div className="text-xs bg-[#FEF8EC] p-3 rounded-lg border border-[#F4DFB4] flex items-start space-x-2">
        <span className="material-symbols-outlined text-[#C68A19] text-sm shrink-0 mt-0.5">info</span>
        <div>
          <strong className="text-[#17211F] block font-semibold mb-0.5">Travel Guidance:</strong>
          <p className="leading-relaxed text-[#17211F]">{recommendedAction}</p>
        </div>
      </div>

      {/* Source & Contact */}
      <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs text-[#66736F]">
        <span>Source: <strong className="text-[#17211F]">{authority}</strong></span>
        <a
          href={`tel:${contactNumber}`}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#D65A4A] hover:bg-[#A83232] text-white font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          <span>Call {contactNumber}</span>
        </a>
      </div>
    </div>
  );
}
