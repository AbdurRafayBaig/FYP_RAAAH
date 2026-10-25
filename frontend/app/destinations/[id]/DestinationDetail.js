"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LanguageContext';
import { isTouristRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { CROWD_DESCRIPTIONS } from '@/constants/crowdLevels';
import { formatAltitude, timeAgo } from '@/lib/format';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import Notice from '@/components/ui/Notice';
import Icon from '@/components/ui/Icon';
import WeatherSummary, { ForecastStrip } from '@/components/destinations/WeatherSummary';
import DestinationMap from '@/components/destinations/DestinationMap';
import DestinationHero from '@/components/destinations/DestinationHero';
import ViewpointGallery from '@/components/destinations/ViewpointGallery';
import CheckInPanel from '@/components/destinations/CheckInPanel';

const CULTURE_LABELS = {
  history: 'History',
  tradition: 'Traditions',
  etiquette: 'Etiquette',
  food: 'Food',
  guideline: 'Responsible travel',
};

function Cell({ icon, label, children }) {
  return (
    <div className="border-rule py-5 sm:px-6 sm:first:ps-0 lg:border-s lg:first:border-s-0">
      <p className="meta mb-2 flex items-center gap-1.5"><Icon name={icon} size={15} /> {label}</p>
      {children}
    </div>
  );
}

function Location({ d, className }) {
  const t = useT();
  return (
    <div className={`border-t border-ink pt-4 ${className}`}>
      <h3 className="text-[20px]">{t('Location')}</h3>
      <div className="mt-3"><DestinationMap destinations={[d]} height={220} /></div>
      <dl className="mt-3 divide-y divide-rule text-[14px]">
        <div className="flex justify-between py-2">
          <dt className="text-muted">{t('Coordinates')}</dt>
          <dd className="data" dir="ltr">{d.location.latitude.toFixed(4)}, {d.location.longitude.toFixed(4)}</dd>
        </div>
      </dl>
    </div>
  );
}

// UC-05 Save Destination: steps 2-4, and alt 3a (already saved: say so and offer to remove it)
function SaveButton({ d, onMessage }) {
  const t = useT();
  const [saved, setSaved] = useState(d.saved);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const result = saved ? await api.removeSavedDestination(d.destinationId) : await api.saveDestination(d.destinationId);
      setSaved(result.saved);
      onMessage({ tone: 'success', text: result.message });
    } catch (err) {
      onMessage({ tone: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={toggle} disabled={busy} aria-pressed={saved} className="btn btn-secondary h-9">
      <Icon name={saved ? 'bookmarkFilled' : 'bookmark'} size={16} />
      {saved ? t('Saved') : t('Save')}
    </button>
  );
}

function ShareButton({ d, onMessage }) {
  const t = useT();
  const share = async () => {
    const url = window.location.href.split('?')[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: `${d.name} — RAAAH`, text: t('Crowd, weather and road conditions at {name}', { name: d.name }), url });
      } else {
        await navigator.clipboard.writeText(url);
        onMessage({ tone: 'success', text: t('Link copied.') });
      }
    } catch (err) {
      if (err.name !== 'AbortError') onMessage({ tone: 'error', text: t('Could not share this page.') });
    }
  };
  return (
    <button type="button" onClick={share} className="btn btn-quiet h-9">
      <Icon name="share" size={16} /> {t('Share')}
    </button>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-[60vh] min-h-[380px] bg-ink/85" />
      <div className="page grid gap-6 border-b border-rule py-6 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 w-16 rounded-[2px] bg-rule" />
            <div className="h-6 w-32 rounded-[2px] bg-rule" />
            <div className="h-3 w-40 rounded-[2px] bg-rule/80" />
          </div>
        ))}
      </div>
      <div className="page mt-12 max-w-[62ch] space-y-3">
        <div className="h-4 rounded-[2px] bg-rule" />
        <div className="h-4 rounded-[2px] bg-rule" />
        <div className="h-4 w-2/3 rounded-[2px] bg-rule" />
      </div>
    </div>
  );
}

// UC-04 Explore Destinations, steps 4-6 (Expanded Use Case Table 41, SSD Fig. 23)
export default function DestinationDetail({ id, continuedWithOriginal }) {
  const { user } = useAuth();
  const t = useT();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // { tone, text } after save or share

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
        <h1 className="text-[32px]">{error.status === 404 ? t('Destination not found') : t('Could not load this destination')}</h1>
        <p className="mt-2 text-ink-2">{error.message}</p>
        <Link href={ROUTES.DESTINATIONS} className="link mt-4 inline-block">{t('Back to destinations')}</Link>
      </div>
    );
  }
  if (!destination) return <DetailSkeleton />;

  const d = destination;
  const tourist = isTouristRole(user?.role);
  const alternativesHref = `${ROUTES.RECOMMENDATIONS}?from=${d.destinationId}`;
  const culture = Object.entries(CULTURE_LABELS)
    .map(([category, label]) => ({ label, items: d.culturalInfo.filter((c) => c.category === category) }))
    .filter((g) => g.items.length > 0);
  const photos = d.gallery?.length ? d.gallery : d.imageUrl ? [{ src: d.imageUrl, caption: d.name }] : [];
  const facts = [
    ['mountain', 'Altitude', formatAltitude(d.altitudeM)],
    ['calendar', 'Best time to visit', d.bestSeason],
    ['bed', 'Places to stay', String(d.accommodationAvailable)],
  ].filter(([, , value]) => value);
  const sections = [
    ['overview', 'Overview'],
    ...(photos.length > 1 ? [['viewpoints', 'Viewpoints']] : []),
    ['what-to-see', 'What to see'],
    ...(culture.length > 0 ? [['culture', 'Culture and history']] : []),
    ...(d.accessInfo.notes ? [['getting-there', 'Getting there']] : []),
  ];
  const mapsSearch = (place) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${d.name}, Pakistan`)}`;

  return (
    <>
      <DestinationHero name={d.name} region={d.region} photos={photos} />

      {/* Section links and actions stay at the top while scrolling the long page */}
      <div className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="page flex h-14 items-center justify-between gap-4">
          <nav aria-label={t('On this page')} className="-mx-1 flex min-w-0 gap-1 overflow-x-auto">
            {sections.map(([anchor, label]) => (
              <a key={anchor} href={`#${anchor}`} className="shrink-0 rounded-[3px] px-2.5 py-1.5 text-[13px] text-ink-2 hover:bg-ink/5 hover:text-ink">
                {t(label)}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <ShareButton d={d} onMessage={setMessage} />
            {tourist && <SaveButton d={d} onMessage={setMessage} />}
          </div>
        </div>
      </div>

      <div className="page pb-20">
        {message && (
          <Notice tone={message.tone} className="mt-6" role="status">{message.text}</Notice>
        )}

        {/* Current conditions - FR-02.05, FR-02.06 */}
        <section className="grid border-b border-rule sm:grid-cols-2 lg:grid-cols-4" aria-label="Current conditions">
          <Cell icon="users" label={t('Crowd')}>
            <CrowdLevel level={d.crowd.crowdLevel} size="md" />
            <p className="meta mt-2">
              {t(CROWD_DESCRIPTIONS[d.crowd.crowdLevel])}{' '}
              {t(d.crowd.activeVisitors === 1 ? '{n} check-in against a capacity of {c}.' : '{n} check-ins against a capacity of {c}.', {
                n: d.crowd.activeVisitors,
                c: d.crowd.capacityThreshold,
              })}
            </p>
          </Cell>
          <Cell icon="cloud" label={t('Weather')}>
            <WeatherSummary weather={d.weather} />
            <ForecastStrip forecast={d.forecast} />
          </Cell>
          <Cell icon="shield" label={t('Safety')}>
            <RiskStatus status={d.riskStatus} size="md" />
            <p className="meta mt-2">
              {d.hazards.length === 0
                ? t('No verified hazard reports.')
                : t(d.hazards.length === 1 ? '{n} verified hazard report.' : '{n} verified hazard reports.', { n: d.hazards.length })}
            </p>
          </Cell>
          <Cell icon="road" label={t('Road access')}>
            <p className="text-[16px]">{t(d.accessInfo.status)}</p>
            {d.accessInfo.road && <p className="meta mt-2">{d.accessInfo.road}</p>}
          </Cell>
        </section>

        {/* UC-09 alt 7a */}
        {continuedWithOriginal && (
          <Notice className="mt-6">{t('You chose to continue with {name}. Check the conditions above before you set off.', { name: d.name })}</Notice>
        )}

        {/* UC-04 alt 6a - warning and offer of alternative recommendations */}
        {d.advisory.needsAlternatives && (
          <Notice
            tone="warning"
            className="mt-6"
            title={t(d.advisory.unsafe ? 'Safety warning' : d.advisory.crowded ? 'This place is busy right now' : 'Before you go')}
            action={
              tourist && !continuedWithOriginal && (
                <Link href={alternativesHref} className="btn btn-accent shrink-0">{t('See quieter alternatives')}</Link>
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
            <section id="overview" className="scroll-mt-20">
              <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-2" dir="ltr">{d.description}</p>
              {d.preferenceMatch.length > 0 && (
                <p className="mt-4 text-[14px] text-ink-2">
                  {t('Matches your interests in')} <span className="text-ink">{d.preferenceMatch.map((p) => t(p)).join('، ')}</span>.
                </p>
              )}
              <dl className="mt-6 grid gap-x-8 gap-y-4 border-y border-rule py-4 sm:grid-cols-3">
                {facts.map(([icon, label, value]) => (
                  <div key={label} className="flex gap-3">
                    <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-muted" />
                    <div>
                      <dt className="meta">{t(label)}</dt>
                      <dd className="mt-0.5 text-[15px] text-ink" dir="ltr">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {photos.length > 1 && (
              <div id="viewpoints" className="scroll-mt-20"><ViewpointGallery name={d.name} photos={photos} /></div>
            )}

            {d.hazards.length > 0 && (
              <section>
                <h2 className="text-[24px]">{t('Verified hazards')}</h2>
                <ul className="mt-4 space-y-4">
                  {d.hazards.map((h) => (
                    <li key={h.reportId} className="border-s-[3px] border-critical ps-4">
                      <p className="font-medium">{t(h.hazardType)} <span className="meta font-normal">· {t('reported')} {timeAgo(h.reportedAt)}</span></p>
                      <p className="text-[14px] text-ink-2" dir="ltr">{h.location}. {h.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FR-02.04 attractions, activities, cultural or historical background */}
            <section id="what-to-see" className="scroll-mt-20">
              <h2 className="text-[24px]">{t('What to see')}</h2>
              <ol className="mt-4 divide-y divide-rule border-y border-rule">
                {d.attractions.map((a, i) => (
                  <li key={a} className="flex items-center gap-4 py-3 text-[15px]">
                    <span className="data w-5 text-muted">{i + 1}</span>
                    <span className="flex-1" dir="ltr">{a}</span>
                    <a
                      href={mapsSearch(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('{place} on the map', { place: a })}
                      className="flex shrink-0 items-center gap-1 text-[13px] text-accent hover:underline"
                    >
                      <Icon name="pin" size={15} /> {t('Map')}
                    </a>
                  </li>
                ))}
              </ol>
              {d.activities.length > 0 && (
                <div className="mt-5">
                  <p className="meta">{t('Things people do here')}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {d.activities.map((a) => (
                      <li key={a} className="rounded-full border border-rule bg-surface px-3 py-1 text-[13px] text-ink-2" dir="ltr">{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {culture.length > 0 && (
              <section id="culture" className="scroll-mt-20">
                <h2 className="text-[24px]">{t('Culture and history')}</h2>
                <dl className="mt-4 space-y-6">
                  {culture.map((g) => (
                    <div key={g.label} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
                      <dt className="meta pt-0.5">{t(g.label)}</dt>
                      <dd className="space-y-3" dir="ltr">
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
              <section id="getting-there" className="scroll-mt-20">
                <h2 className="text-[24px]">{t('Getting there')}</h2>
                <p className="mt-3 text-[15px] text-ink-2" dir="ltr">{d.accessInfo.road}. {d.accessInfo.notes}</p>
              </section>
            )}
          </div>

          {/* On a phone the check-in comes first: the tourist is usually standing at the destination */}
          {tourist && (
            <aside className="order-first space-y-10 lg:order-none lg:col-start-2 lg:row-start-1">
              <CheckInPanel destination={d} onCheckedIn={load} />
              <div className="border-t border-ink pt-4">
                <h3 className="text-[20px]">{t('Somewhere quieter?')}</h3>
                <p className="mt-2 text-[14px] text-ink-2">
                  {t('Get places ranked by your interests, current crowd, safety and distance.')}
                </p>
                <Link href={alternativesHref} className="mt-3 flex items-center gap-1.5 text-[14px] font-medium text-accent hover:underline">
                  {t('Show alternatives')} <Icon name="arrow" size={16} />
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
