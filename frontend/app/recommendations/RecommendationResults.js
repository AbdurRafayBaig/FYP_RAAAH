"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { sizedImage, timeAgo } from '@/lib/format';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import WeatherSummary from '@/components/destinations/WeatherSummary';

// The tourist's location is collected only with consent (FR-01.07) and only if the browser allows it.
function tryGetLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

// Step 2: preferences and visit history are read on the server; the location is added here
async function fetchRecommendations(sourceId, consent) {
  const location = consent ? await tryGetLocation() : null;
  return api.getRecommendations({
    ...(sourceId && { sourceDestinationId: sourceId }),
    ...(location || {}),
  });
}

// UC-09 alt 6a - safety information of the selected destination
function SourceSafety({ source }) {
  return (
    <div className="mt-6 grid gap-6 border-t border-rule pt-5 sm:grid-cols-3">
      <div><p className="meta mb-2">Crowd</p><CrowdLevel level={source.crowd.crowdLevel} /></div>
      <div><p className="meta mb-2">Safety</p><RiskStatus status={source.riskStatus} /></div>
      <div><p className="meta mb-2">Weather</p><WeatherSummary weather={source.weather} /></div>
      {source.hazards.length > 0 && (
        <ul className="space-y-3 sm:col-span-3">
          {source.hazards.map((h) => (
            <li key={h.reportId} className="border-l-[3px] border-critical pl-4 text-[14px]">
              <span className="font-medium">{h.hazardType}</span> <span className="meta">· reported {timeAgo(h.reportedAt)}</span>
              <p className="text-ink-2">{h.location}. {h.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// UC-09 Get Alternative Destination Recommendations (Expanded Use Case Table 46, SSD Fig. 28)
export default function RecommendationResults({ sourceId }) {
  const { user } = useAuth();
  const consent = Boolean(user?.locationConsent);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loading: true, result: null, error: '' });

  useEffect(() => {
    let cancelled = false;
    fetchRecommendations(sourceId, consent).then(
      (result) => !cancelled && setState({ loading: false, result, error: '' }),
      (err) => !cancelled && setState({ loading: false, result: null, error: err.message }),
    );
    return () => {
      cancelled = true;
    };
  }, [sourceId, consent, attempt]);

  const retry = () => {
    setState({ loading: true, result: null, error: '' });
    setAttempt((a) => a + 1);
  };

  const { loading, result, error } = state;
  const source = result?.source;

  return (
    <div className="page pb-20">
      <PageTitle title={source ? `Instead of ${source.name}` : 'Places that suit you'}>
        Ranked by your interests and past visits, then by current crowd, safety, weather, distance, road access and
        places to stay.
      </PageTitle>

      {loading && <p className="meta py-10">Comparing destinations…</p>}

      {!loading && error && (
        <Notice tone="error" className="mt-8" action={<button onClick={retry} className="btn btn-secondary shrink-0">Try again</button>}>
          {error}
        </Notice>
      )}

      {!loading && result && (
        <>
          {/* Selected destination and why alternatives are suggested */}
          {source && (
            <section className="border-b border-rule py-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-xl">
                  <p className="meta">You picked</p>
                  <p className="font-display text-[26px]">{source.name}</p>
                  {source.advisory.needsAlternatives ? (
                    <ul className="mt-2 space-y-0.5 text-[14px] text-ink-2">
                      {source.advisory.reasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-2 text-[14px] text-ink-2">Conditions there look fine. These are other places you may like.</p>
                  )}
                </div>
                {/* FR-05.06 / alt 7a - continue with the original destination */}
                <Link href={`/destinations/${source.destinationId}?continue=1`} className="btn btn-secondary shrink-0">
                  Go to {source.name} anyway
                </Link>
              </div>
              {result.noSuitableAlternative && <SourceSafety source={source} />}
            </section>
          )}

          {/* UC-09 alt 6a */}
          {result.noSuitableAlternative ? (
            <div className="py-12">
              <p className="font-display text-[24px]">No suitable alternative right now</p>
              <p className="mt-2 max-w-xl text-ink-2">{result.message}</p>
            </div>
          ) : (
            <ol>
              {result.recommendations.map((r) => {
                const d = r.destination;
                return (
                  <li key={d.destinationId} className="border-b border-rule py-7">
                    <Link href={`/destinations/${d.destinationId}`} className="group grid gap-5 sm:grid-cols-[48px_200px_1fr_auto] sm:items-start">
                      <span className="font-display text-[36px] leading-none text-muted">{r.rank}</span>
                      <div className="relative aspect-[4/3] overflow-hidden bg-rule">
                        {d.imageUrl && <Image src={sizedImage(d.imageUrl, 500)} alt={d.name} fill sizes="200px" className="object-cover" />}
                      </div>
                      <div>
                        <h2 className="text-[24px] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{d.name}</h2>
                        <p className="meta">{d.region}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
                          <CrowdLevel level={d.crowd.crowdLevel} />
                          <RiskStatus status={d.riskStatus} />
                          {d.weather && <WeatherSummary weather={d.weather} compact />}
                        </div>
                        <p className="mt-3 max-w-[62ch] text-[14px] text-ink-2">{r.reasons.join(' · ')}</p>
                      </div>
                      <p className="sm:text-right">
                        <span className="font-mono text-[22px] text-ink">{Math.round(r.score * 100)}%</span>
                        <span className="meta block">match</span>
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="meta mt-6">
            {result.usedLocation
              ? 'Distances are from your current location.'
              : source
                ? `Distances are from ${source.name}. Turn on location consent to measure from where you are.`
                : 'Turn on location consent to include distance from where you are.'}{' '}
            <Link href={ROUTES.PROFILE} className="link">Edit your interests</Link>
          </p>
        </>
      )}
    </div>
  );
}
