"use client";

import Link from 'next/link';
import Image from 'next/image';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import { formatAltitude } from '@/lib/format';
import WeatherSummary from './WeatherSummary';

// A destination as returned by the Destination Information Service
export default function DestinationTile({ destination, distanceKm = null }) {
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
        {distanceKm !== null && (
          <span className="absolute start-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[12px] text-white" dir="ltr">
            {Math.round(distanceKm)} km
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[20px] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4" dir="ltr">{name}</h3>
        {weather && <WeatherSummary weather={weather} compact />}
      </div>
      <p className="meta" dir="ltr">{region}{altitudeM ? ` · ${formatAltitude(altitudeM)}` : ''}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        <CrowdLevel level={crowd.crowdLevel} />
        <RiskStatus status={riskStatus} />
      </div>
    </Link>
  );
}

// Shown while the list is loading, in the shape of a tile
export function DestinationTileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-rule" />
      <div className="mt-3 h-5 w-2/3 rounded-[2px] bg-rule" />
      <div className="mt-2 h-3.5 w-1/2 rounded-[2px] bg-rule/80" />
      <div className="mt-3 h-3.5 w-3/5 rounded-[2px] bg-rule/80" />
    </div>
  );
}
