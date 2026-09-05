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
    safetyStatus,
    weather,
    image
  } = destination;

  return (
    <div className="raah-card raah-card-hover overflow-hidden flex flex-col h-full">
      {/* Destination Image */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        
        {/* Weather overlay */}
        <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-medium text-[#17211F] flex items-center space-x-1 shadow-2xs border border-stone-200">
          <span className="material-symbols-outlined text-amber-600 text-sm">{weather?.icon || 'wb_sunny'}</span>
          <span>{weather?.temp || '18°C'}</span>
        </div>
      </div>

      {/* Destination Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66736F] uppercase tracking-wide">
              {region}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#17211F] mt-0.5 leading-tight">
            {name}
          </h3>
          {tagline && (
            <p className="text-xs text-[#66736F] line-clamp-2 mt-1 leading-relaxed">
              {tagline}
            </p>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <CrowdBadge level={crowdLevel} size="sm" />
          <SafetyBadge status={safetyStatus} />
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Link
            href={`/destinations/${id}`}
            className="w-full inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-[#F7F8F5] hover:bg-[#164A41] hover:text-white border border-stone-200 text-xs font-semibold text-[#164A41] transition-colors"
          >
            <span>View Destination</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
