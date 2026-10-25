"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { timeAgo } from '@/lib/format';
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

// Where distances are measured from, and what the tourist can do to measure them from where they are
function distanceNote(usedLocation, consent, source) {
  if (usedLocation) return 'Distances are from your current location.';
  const from = source ? `Distances are from ${source.name}.` : 'Distance from where you are is not included.';
  // Consent is given, but the browser did not share the location (permission blocked or no fix)
  if (consent) return `${from} Your browser did not share your location; allow it for this site to measure from where you are.`;
  return `${from} Turn on location consent in your profile to measure from where you are.`;
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

// Factors of the AI Recommendation Engine (ai-engine/app/scoring.py) and their weights
const FACTORS = [
  ['preference', 'Your interests', 30],
  ['crowd', 'Crowd', 20],
  ['safety', 'Safety', 20],
  ['weather', 'Weather', 10],
  ['distance', 'Distance', 10],
  ['accessibility', 'Road access', 5],
  ['accommodation', 'Places to stay', 5],
];

function FactorBars({ factors }) {
  return (
    <dl className="mt-3 grid max-w-md grid-cols-2 gap-x-5 gap-y-1.5 sm:grid-cols-3">
      {FACTORS.filter(([key]) => factors?.[key] !== undefined).map(([key, label]) => (
        <div key={key}>
          <dt className="text-[12px] text-muted">{label}</dt>
          <dd className="mt-0.5 h-1.5 rounded-full bg-rule" title={`${Math.round(factors[key] * 100)}%`}>
            <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.round(factors[key] * 100)}%` }} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function HowMatchWorks() {
  return (
    <details className="mt-6 border-y border-rule py-3 text-[14px] text-ink-2">
      <summary className="cursor-pointer font-medium text-ink">How is the match calculated?</summary>
      <p className="mt-3 max-w-[70ch]">
        Each place gets a score from 0 to 1 for every factor below. The match is their weighted average. Places
        that are closed, at High Risk or over capacity are left out, and places you have visited before are moved
        slightly down so you discover new ones.
      </p>
      <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {FACTORS.map(([key, label, weight]) => (
          <li key={key} className="flex justify-between gap-4 border-b border-rule py-1">
            <span>{label}</span><span className="data">{weight}%</span>
          </li>
        ))}
      </ul>
      <p className="meta mt-3">Distance only counts when RAAAH knows where you are or which place you started from.</p>
    </details>
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

      <HowMatchWorks />

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
                        {d.imageUrl && <Image src={d.imageUrl} alt={d.name} fill sizes="200px" className="object-cover" />}
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
                        {source && (
                          <p className="meta mt-1">
                            Compared with {source.name}: {source.crowd.crowdLevel.toLowerCase()} crowd, {source.riskStatus.toLowerCase()}.
                          </p>
                        )}
                        <FactorBars factors={r.factors} />
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
            {distanceNote(result.usedLocation, consent, source)}{' '}
            <Link href={ROUTES.PROFILE} className="link">Edit your interests</Link>
          </p>
        </>
      )}
    </div>
  );
}
