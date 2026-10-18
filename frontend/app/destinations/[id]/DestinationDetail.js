"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { isTouristRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { CROWD_DESCRIPTIONS } from '@/constants/crowdLevels';
import { timeAgo } from '@/lib/format';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import Notice from '@/components/ui/Notice';
import Icon from '@/components/ui/Icon';
import WeatherSummary from '@/components/destinations/WeatherSummary';
import DestinationMap from '@/components/destinations/DestinationMap';
import CheckInPanel from '@/components/destinations/CheckInPanel';

const CULTURE_LABELS = {
  history: 'History',
  tradition: 'Traditions',
  etiquette: 'Etiquette',
  food: 'Food',
  guideline: 'Responsible travel',
};

function Cell({ label, children }) {
  return (
    <div className="border-rule py-5 sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0">
      <p className="meta mb-2">{label}</p>
      {children}
    </div>
  );
}

function Location({ d, className }) {
  return (
    <div className={`border-t border-ink pt-4 ${className}`}>
      <h3 className="text-[20px]">Location</h3>
      <div className="mt-3"><DestinationMap destinations={[d]} height={220} /></div>
      <dl className="mt-3 divide-y divide-rule text-[14px]">
        <div className="flex justify-between py-2"><dt className="text-muted">Coordinates</dt><dd className="data">{d.location.latitude.toFixed(4)}, {d.location.longitude.toFixed(4)}</dd></div>
        <div className="flex justify-between py-2"><dt className="text-muted">Places to stay</dt><dd className="data">{d.accommodationAvailable}</dd></div>
      </dl>
    </div>
  );
}

// UC-04 Explore Destinations, steps 4-6 (Expanded Use Case Table 41, SSD Fig. 23)
export default function DestinationDetail({ id, continuedWithOriginal }) {
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      api.getDestination(id)
        .then(({ destination }) => setDestination(destination))
        .catch((err) => setError(err)),
    [id],
  );

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="page py-24">
        <h1 className="text-[32px]">{error.status === 404 ? 'Destination not found' : 'Could not load this destination'}</h1>
        <p className="mt-2 text-ink-2">{error.message}</p>
        <Link href={ROUTES.DESTINATIONS} className="link mt-4 inline-block">Back to destinations</Link>
      </div>
    );
  }
  if (!destination) return <p className="page py-24 meta">Loading…</p>;

  const d = destination;
  const tourist = isTouristRole(user?.role);
  const alternativesHref = `${ROUTES.RECOMMENDATIONS}?from=${d.destinationId}`;
  const culture = Object.entries(CULTURE_LABELS)
    .map(([category, label]) => ({ label, items: d.culturalInfo.filter((c) => c.category === category) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Photo and name */}
      <section className="relative h-[52vh] min-h-[340px] bg-ink text-white">
        {d.imageUrl && <Image src={d.imageUrl} alt={d.name} fill priority sizes="100vw" className="object-cover opacity-90" />}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_30%,transparent_55%,rgba(0,0,0,0.7))]" />
        <div className="page relative flex h-full flex-col justify-end pb-8">
          <Link href={ROUTES.DESTINATIONS} className="mb-auto mt-6 flex w-fit items-center gap-1.5 text-[13px] text-white/80 hover:text-white">
            <Icon name="back" size={16} /> All destinations
          </Link>
          <p className="text-[14px] text-white/80">{d.region}</p>
          <h1 className="mt-1 text-[40px] sm:text-[56px]">{d.name}</h1>
        </div>
      </section>

      <div className="page pb-20">
        {/* Current conditions - FR-02.05, FR-02.06 */}
        <section className="grid border-b border-rule sm:grid-cols-2 lg:grid-cols-4" aria-label="Current conditions">
          <Cell label="Crowd">
            <CrowdLevel level={d.crowd.crowdLevel} size="md" />
            <p className="meta mt-2">
              {CROWD_DESCRIPTIONS[d.crowd.crowdLevel]} <span className="data">{d.crowd.activeVisitors}</span> check-in{d.crowd.activeVisitors === 1 ? '' : 's'}{' '}
              against a capacity of <span className="data">{d.crowd.capacityThreshold}</span>.
            </p>
          </Cell>
          <Cell label="Weather">
            <WeatherSummary weather={d.weather} />
          </Cell>
          <Cell label="Safety">
            <RiskStatus status={d.riskStatus} size="md" />
            <p className="meta mt-2">
              {d.hazards.length === 0 ? 'No verified hazard reports.' : `${d.hazards.length} verified hazard report${d.hazards.length > 1 ? 's' : ''}.`}
            </p>
          </Cell>
          <Cell label="Road access">
            <p className="text-[16px]">{d.accessInfo.status}</p>
            {d.accessInfo.road && <p className="meta mt-2">{d.accessInfo.road}</p>}
          </Cell>
        </section>

        {/* UC-09 alt 7a */}
        {continuedWithOriginal && (
          <Notice className="mt-6">You chose to continue with {d.name}. Check the conditions above before you set off.</Notice>
        )}

        {/* UC-04 alt 6a - warning and offer of alternative recommendations */}
        {d.advisory.needsAlternatives && (
          <Notice
            tone="warning"
            className="mt-6"
            title={d.advisory.unsafe ? 'Safety warning' : d.advisory.crowded ? 'This place is busy right now' : 'Before you go'}
            action={
              tourist && !continuedWithOriginal && (
                <Link href={alternativesHref} className="btn btn-primary shrink-0">See quieter alternatives</Link>
              )
            }
          >
            <ul className="mt-1 space-y-0.5">
              {d.advisory.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Notice>
        )}

        {/* One map per page (each Google Maps load counts towards the free monthly limit), placed by the grid:
            after the description on a phone, under the check-in on a desktop */}
        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_1fr] lg:gap-y-10">
          <div className="space-y-12 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <section>
              <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{d.description}</p>
              {d.preferenceMatch.length > 0 && (
                <p className="mt-4 text-[14px] text-ink-2">
                  Matches your interests in <span className="text-ink">{d.preferenceMatch.join(', ')}</span>.
                </p>
              )}
            </section>

            {d.hazards.length > 0 && (
              <section>
                <h2 className="text-[24px]">Verified hazards</h2>
                <ul className="mt-4 space-y-4">
                  {d.hazards.map((h) => (
                    <li key={h.reportId} className="border-l-[3px] border-critical pl-4">
                      <p className="font-medium">{h.hazardType} <span className="meta font-normal">· reported {timeAgo(h.reportedAt)}</span></p>
                      <p className="text-[14px] text-ink-2">{h.location}. {h.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FR-02.04 attractions, activities, cultural or historical background */}
            <section>
              <h2 className="text-[24px]">What to see</h2>
              <ol className="mt-4 divide-y divide-rule border-y border-rule">
                {d.attractions.map((a, i) => (
                  <li key={a} className="flex gap-4 py-3 text-[15px]">
                    <span className="data w-5 text-muted">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
              {d.activities.length > 0 && (
                <p className="mt-4 text-[14px] text-ink-2">
                  Things people do here: {d.activities.join(', ').toLowerCase()}.
                </p>
              )}
            </section>

            {culture.length > 0 && (
              <section>
                <h2 className="text-[24px]">Culture and history</h2>
                <dl className="mt-4 space-y-6">
                  {culture.map((g) => (
                    <div key={g.label} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
                      <dt className="meta pt-0.5">{g.label}</dt>
                      <dd className="space-y-3">
                        {g.items.map((c) => (
                          <div key={c.infoId}>
                            <p className="font-medium">{c.title}</p>
                            <p className="text-[15px] text-ink-2">{c.content}</p>
                          </div>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {d.accessInfo.notes && (
              <section>
                <h2 className="text-[24px]">Getting there</h2>
                <p className="mt-3 text-[15px] text-ink-2">{d.accessInfo.road}. {d.accessInfo.notes}</p>
              </section>
            )}

          </div>

          {/* On a phone the check-in comes first: the tourist is usually standing at the destination */}
          {tourist && (
            <aside className="order-first space-y-10 lg:order-none lg:col-start-2 lg:row-start-1">
              <CheckInPanel destination={d} onCheckedIn={load} />
              <div className="border-t border-ink pt-4">
                <h3 className="text-[20px]">Somewhere quieter?</h3>
                <p className="mt-2 text-[14px] text-ink-2">
                  Get places ranked by your interests, current crowd, safety and distance.
                </p>
                <Link href={alternativesHref} className="mt-3 flex items-center gap-1.5 text-[14px] font-medium hover:underline">
                  Show alternatives <Icon name="arrow" size={16} />
                </Link>
              </div>
            </aside>
          )}

          <Location d={d} className={`self-start lg:col-start-2 ${tourist ? 'lg:row-start-2' : 'lg:row-span-2 lg:row-start-1'}`} />
        </div>
      </div>
    </>
  );
}
