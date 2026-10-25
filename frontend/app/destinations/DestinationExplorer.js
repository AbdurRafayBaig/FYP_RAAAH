"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useT } from '@/context/LanguageContext';
import { CROWD_LEVELS } from '@/constants/crowdLevels';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';
import Icon from '@/components/ui/Icon';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import DestinationTile, { DestinationTileSkeleton } from '@/components/destinations/DestinationTile';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherSummary from '@/components/destinations/WeatherSummary';

const VIEWS = ['Photos', 'Table', 'Map'];
const ALL_REGIONS = 'All regions';
const SORTS = ['Name', 'Quietest first', 'Safest first', 'Nearest to me'];
const RISK_ORDER = ['Low Risk', 'Elevated Risk', 'High Risk'];

// "Gojal, Hunza, Gilgit-Baltistan" -> "Gilgit-Baltistan"
const provinceOf = (region) => region.split(',').at(-1).trim();

// Straight-line distance in km. The position is used on this device only and never sent anywhere.
function distanceKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const h = Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function Segmented({ options, value, onChange, label }) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`h-10 rounded-[3px] px-3 text-[13px] lg:h-8 ${value === o ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/5'}`}
        >
          {t(o)}
        </button>
      ))}
    </div>
  );
}

function ConditionsTable({ destinations }) {
  const t = useT();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-start text-[14px]">
        <thead>
          <tr className="border-b border-ink text-[12px] text-muted">
            <th className="py-2 pe-4 text-start font-medium">{t('Destination')}</th>
            <th className="py-2 pe-4 text-start font-medium">{t('Crowd')}</th>
            <th className="py-2 pe-4 text-end font-medium">{t('Check-ins / capacity')}</th>
            <th className="py-2 pe-4 text-start font-medium">{t('Safety')}</th>
            <th className="py-2 pe-4 text-start font-medium">{t('Weather')}</th>
            <th className="py-2 text-start font-medium">{t('Access')}</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.destinationId} className="border-b border-rule hover:bg-surface">
              <td className="py-3 pe-4">
                <Link href={`/destinations/${d.destinationId}`} className="font-medium hover:underline">{d.name}</Link>
                <span className="meta block">{d.region}</span>
              </td>
              <td className="py-3 pe-4"><CrowdLevel level={d.crowd.crowdLevel} /></td>
              <td className="data py-3 pe-4 text-end" dir="ltr">{d.crowd.activeVisitors} / {d.crowd.capacityThreshold}</td>
              <td className="py-3 pe-4"><RiskStatus status={d.riskStatus} /></td>
              <td className="py-3 pe-4"><WeatherSummary weather={d.weather} compact /></td>
              <td className="py-3 text-ink-2">{t(d.accessInfo.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// UC-04 Explore Destinations, steps 1-3 (Expanded Use Case Table 41, SSD Fig. 23)
export default function DestinationExplorer({ initialSearch }) {
  const t = useT();
  const [search, setSearch] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [crowd, setCrowd] = useState('Any');
  const [province, setProvince] = useState(ALL_REGIONS);
  const [sort, setSort] = useState('Name');
  const [position, setPosition] = useState(null);
  const [positionError, setPositionError] = useState('');
  const [view, setView] = useState('Photos');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce typing before asking the server to search
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    api.listDestinations(query)
      .then((data) => {
        if (cancelled) return;
        setDestinations(data.destinations);
        setError('');
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]);

  const chooseSort = (value) => {
    setPositionError('');
    if (value === 'Nearest to me' && !position) {
      if (!navigator.geolocation) {
        setPositionError(t('Your browser cannot share your location.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setPosition({ latitude: p.coords.latitude, longitude: p.coords.longitude });
          setSort(value);
        },
        () => setPositionError(t('Allow location for this site to sort by distance.')),
        { timeout: 8000, maximumAge: 5 * 60 * 1000 },
      );
      return;
    }
    setSort(value);
  };

  const provinces = useMemo(() => [...new Set(destinations.map((d) => provinceOf(d.region)))].sort(), [destinations]);

  const visible = useMemo(() => {
    const list = destinations.filter((d) =>
      (crowd === 'Any' || d.crowd.crowdLevel === crowd) &&
      (province === ALL_REGIONS || provinceOf(d.region) === province));
    const by = {
      'Quietest first': (a, b) => a.crowd.activeVisitors / a.crowd.capacityThreshold - b.crowd.activeVisitors / b.crowd.capacityThreshold,
      'Safest first': (a, b) => RISK_ORDER.indexOf(a.riskStatus) - RISK_ORDER.indexOf(b.riskStatus) || a.name.localeCompare(b.name),
      'Nearest to me': (a, b) => distanceKm(position, a.location) - distanceKm(position, b.location),
    }[sort];
    return by && (sort !== 'Nearest to me' || position) ? [...list].sort(by) : list;
  }, [destinations, crowd, province, sort, position]);

  const activeFilters = (crowd !== 'Any') + (province !== ALL_REGIONS) + (sort !== 'Name');
  const filtered = search || crowd !== 'Any' || province !== ALL_REGIONS;
  const clearFilters = () => {
    setSearch('');
    setCrowd('Any');
    setProvince(ALL_REGIONS);
  };

  return (
    <div className="page pb-20">
      <PageTitle title={t('Destinations')}>
        {t('Crowd levels come from active check-ins, safety status from verified reports. Open a destination for the weather, road access and hazard details.')}
      </PageTitle>

      <div className="flex flex-col gap-4 border-b border-rule py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex max-w-md flex-1 items-center gap-2 border-b border-ink/40 focus-within:border-ink">
            <Icon name="search" className="text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search by name, region or attraction')}
              aria-label={t('Search destinations')}
              className="h-11 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
            />
          </div>
          {/* On a phone the filters fold away, so the destinations are visible straight away */}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="btn btn-secondary h-11 shrink-0 lg:hidden"
          >
            <Icon name="filters" size={16} /> {t('Filters')}{activeFilters > 0 && <span className="data">({activeFilters})</span>}
          </button>
        </div>
        <div className={`${filtersOpen ? 'flex' : 'hidden'} flex-col gap-4 lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6`}>
          <div className="flex flex-wrap gap-3">
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              aria-label={t('Filter by region')}
              className="h-10 rounded-[3px] border border-rule bg-surface px-2 text-[13px] text-ink-2 focus:border-ink focus:outline-none lg:h-8"
            >
              {[ALL_REGIONS, ...provinces].map((p) => <option key={p} value={p}>{t(p)}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => chooseSort(e.target.value)}
              aria-label={t('Sort')}
              className="h-10 rounded-[3px] border border-rule bg-surface px-2 text-[13px] text-ink-2 focus:border-ink focus:outline-none lg:h-8"
            >
              {SORTS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="meta">{t('Crowd')}</span>
            <Segmented options={['Any', ...CROWD_LEVELS]} value={crowd} onChange={setCrowd} label={t('Filter by crowd level')} />
          </div>
          <Segmented options={VIEWS} value={view} onChange={setView} label={t('View')} />
        </div>
      </div>

      {positionError && <Notice tone="warning" className="mt-4">{positionError}</Notice>}

      <p className="meta py-4" aria-live="polite">
        {loading ? t('Loading…') : t(visible.length === 1 ? '{n} destination' : '{n} destinations', { n: visible.length })}
      </p>

      {error ? (
        <Notice tone="error">{error}</Notice>
      ) : loading ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => <DestinationTileSkeleton key={i} />)}
        </div>
      ) : visible.length === 0 ? (
        // UC-04 alt 3a
        <div className="py-16">
          <p className="font-display text-[26px]">{t('No destinations found')}</p>
          <p className="mt-2 text-ink-2">{t('Try another name, or clear the filters.')}</p>
          {filtered && (
            <button onClick={clearFilters} className="btn btn-secondary mt-5">
              {t('Clear search and filters')}
            </button>
          )}
        </div>
      ) : view === 'Map' ? (
        <DestinationMap destinations={visible} height={560} />
      ) : view === 'Table' ? (
        <ConditionsTable destinations={visible} />
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DestinationTile
              key={d.destinationId}
              destination={d}
              distanceKm={sort === 'Nearest to me' && position ? distanceKm(position, d.location) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
