import Link from 'next/link';
import Image from 'next/image';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import { formatAltitude } from '@/lib/format';
import WeatherSummary from './WeatherSummary';

// A destination as returned by the Destination Information Service
export default function DestinationTile({ destination }) {
  const { destinationId, name, region, imageUrl, altitudeM, crowd, riskStatus, weather } = destination;

  return (
    <Link href={`/destinations/${destinationId}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-rule">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[20px] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{name}</h3>
        {weather && <WeatherSummary weather={weather} compact />}
      </div>
      <p className="meta">{region}{altitudeM ? ` · ${formatAltitude(altitudeM)}` : ''}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        <CrowdLevel level={crowd.crowdLevel} />
        <RiskStatus status={riskStatus} />
      </div>
    </Link>
  );
}
