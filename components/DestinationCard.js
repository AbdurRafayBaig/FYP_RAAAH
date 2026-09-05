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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CrowdBadge level={crowdLevel} score={crowdScore} size="sm" />
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center space-x-1 shadow-xs border border-gray-200">
            <span className="material-symbols-outlined text-amber-500 text-sm">{weather.icon}</span>
            <span>{weather.temp}</span>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300">
            {region}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-white leading-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {tagline}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">Live Visitors</span>
            <span className="font-extrabold text-gray-900 text-sm font-mono">{liveVisitors.toLocaleString()}</span>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">Available Lodges</span>
            <span className="font-extrabold text-emerald-700 text-sm font-mono">{accommodationsAvailable} Open</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <SafetyBadge status={safetyStatus} />
          <Link
            href={`/destinations/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <span>View Guide</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
