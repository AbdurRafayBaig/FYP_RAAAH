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
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E5E3DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CrowdBadge level={crowdLevel} score={crowdScore} size="sm" />
          <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 flex items-center space-x-1 shadow-sm">
            <span className="material-symbols-outlined text-amber-500 text-sm">{weather.icon}</span>
            <span>{weather.temp}</span>
          </div>
        </div>

        {/* Bottom Image Title */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300">
            {region}
          </span>
          <h3 className="font-serif-editorial text-2xl font-bold tracking-wide group-hover:text-amber-200 transition-colors">
            {name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-[#575A60] line-clamp-2 leading-relaxed">
          {tagline}
        </p>

        {/* Live Visitor & Hotel Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EEE9] text-xs">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <span className="material-symbols-outlined text-blue-600 text-base">groups</span>
            <div>
              <span className="block font-bold text-slate-900">{liveVisitors.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 uppercase">Live Tourists</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700">
            <span className="material-symbols-outlined text-emerald-600 text-base">hotel</span>
            <div>
              <span className="block font-bold text-slate-900">{accommodationsAvailable} Open</span>
              <span className="text-[10px] text-slate-500 uppercase">Lodges</span>
            </div>
          </div>
        </div>

        {/* Safety & View Details */}
        <div className="flex items-center justify-between pt-2">
          <SafetyBadge status={safetyStatus} />
          <Link
            href={`/destinations/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#041627] hover:text-[#0051D5] transition-colors"
          >
            <span>Explore Guide</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
