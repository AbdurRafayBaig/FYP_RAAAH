import Link from 'next/link';
import Image from 'next/image';
import CrowdBadge from '@/components/CrowdBadge';
import SafetyBadge from '@/components/SafetyBadge';
import WeatherSummary from './WeatherSummary';

// Destination card for data returned by the Destination Information Service
export default function DestinationSummaryCard({ destination }) {
  const { destinationId, name, region, description, imageUrl, crowd, riskStatus, weather } = destination;

  return (
    <div className="raah-card raah-card-hover overflow-hidden flex flex-col h-full">
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        {imageUrl && <Image src={imageUrl} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />}
        {weather && (
          <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full shadow-2xs border border-stone-200">
            <WeatherSummary weather={weather} compact />
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-[#66736F] uppercase tracking-wide">{region}</span>
          <h3 className="text-lg font-bold text-[#17211F] mt-0.5 leading-tight">{name}</h3>
          <p className="text-xs text-[#66736F] line-clamp-2 mt-1 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <CrowdBadge level={crowd.crowdLevel} size="sm" />
          <SafetyBadge status={riskStatus} />
        </div>

        <Link
          href={`/destinations/${destinationId}`}
          className="w-full inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-[#F7F8F5] hover:bg-[#164A41] hover:text-white border border-stone-200 text-xs font-semibold text-[#164A41] transition-colors"
        >
          <span>View Destination</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
