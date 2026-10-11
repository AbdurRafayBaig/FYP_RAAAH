"use client";

import Link from 'next/link';
import { useState } from 'react';
import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin } from '@vis.gl/react-google-maps';
import { CROWD_COLORS } from '@/constants/crowdLevels';
import CrowdLevel from '@/components/ui/CrowdLevel';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const GB_CENTER = { lat: 35.8, lng: 74.9 };

// Without an API key, the keyless Google Maps embed is shown instead of the interactive map
function EmbedFallback({ destinations, height }) {
  const single = destinations.length === 1 ? destinations[0] : null;
  const query = single ? `${single.location.latitude},${single.location.longitude}` : 'Gilgit-Baltistan, Pakistan';
  return (
    <div>
      <iframe
        title={single ? `Map of ${single.name}` : 'Map of Northern Pakistan'}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${single ? 11 : 7}&output=embed`}
        className="w-full border border-rule grayscale-[30%]"
        style={{ height }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {!single && (
        <p className="meta mt-2">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show every destination as a marker coloured by crowd level.
        </p>
      )}
    </div>
  );
}

// FR-02.02 - destination locations on a map using the Google Maps API
export default function DestinationMap({ destinations, height = 380 }) {
  const [selectedId, setSelectedId] = useState(null);

  if (!API_KEY) return <EmbedFallback destinations={destinations} height={height} />;

  const single = destinations.length === 1 ? destinations[0] : null;
  const center = single ? { lat: single.location.latitude, lng: single.location.longitude } : GB_CENTER;
  const selected = destinations.find((d) => d.destinationId === selectedId);

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="w-full overflow-hidden border border-rule" style={{ height }}>
        <Map defaultCenter={center} defaultZoom={single ? 11 : 7} mapId={MAP_ID} gestureHandling="cooperative">
          {destinations.map((d) => (
            <AdvancedMarker
              key={d.destinationId}
              position={{ lat: d.location.latitude, lng: d.location.longitude }}
              title={`${d.name} - ${d.crowd.crowdLevel} crowd`}
              onClick={() => setSelectedId(d.destinationId)}
            >
              <Pin background={CROWD_COLORS[d.crowd.crowdLevel]} borderColor="#ffffff" glyphColor="#ffffff" />
            </AdvancedMarker>
          ))}
          {selected && !single && (
            <InfoWindow
              position={{ lat: selected.location.latitude, lng: selected.location.longitude }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="space-y-1.5 font-sans">
                <p className="font-display text-[16px]">{selected.name}</p>
                <CrowdLevel level={selected.crowd.crowdLevel} />
                <Link href={`/destinations/${selected.destinationId}`} className="link block text-[13px]">
                  View destination
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
