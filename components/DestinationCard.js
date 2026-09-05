import Link from 'next/link';
import Image from 'next/image';
import CrowdBadge from './CrowdBadge';
import SafetyBadge from './SafetyBadge';

export default function DestinationCard({ destination }) {
  const {
    id,
    name,
    region,
    tagline,
    crowdLevel,
    crowdScore,
    safetyStatus,
    weather,
    image,
    accommodationsAvailable,
    liveVisitors
  } = destination;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#E2E8E4] shadow-xs hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700 opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05100C] via-[#05100C]/30 to-transparent"></div>

        {/* Top Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <CrowdBadge level={crowdLevel} score={crowdScore} size="sm" />
          <div className="bg-[#05100C]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1 border border-white/10 shadow-sm">
            <span className="material-symbols-outlined text-amber-400 text-sm">{weather.icon}</span>
            <span>{weather.temp}</span>
          </div>
        </div>

        {/* Bottom Image Title */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A373]">
            {region}
          </span>
          <h3 className="font-serif-editorial text-2xl font-bold tracking-wide group-hover:text-[#D4A373] transition-colors">
            {name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <p className="text-xs text-[#52635D] line-clamp-2 leading-relaxed font-light">
          {tagline}
        </p>

        {/* Live Visitor & Hotel Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F0EEE9] text-xs">
          <div className="flex items-center space-x-2 text-slate-800">
            <span className="material-symbols-outlined text-[#164E3D] text-lg">groups</span>
            <div>
              <span className="block font-bold font-mono text-slate-900">{liveVisitors.toLocaleString()}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Tourists</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-800">
            <span className="material-symbols-outlined text-[#D4A373] text-lg">hotel</span>
            <div>
              <span className="block font-bold font-mono text-slate-900">{accommodationsAvailable} Open</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Eco Lodges</span>
            </div>
          </div>
        </div>

        {/* Safety & View Details */}
        <div className="flex items-center justify-between pt-2">
          <SafetyBadge status={safetyStatus} />
          <Link
            href={`/destinations/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#0D241C] hover:text-[#D4A373] transition-colors"
          >
            <span>Explore</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
