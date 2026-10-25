"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { CROWD_LEVELS } from '@/constants/crowdLevels';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';
import Icon from '@/components/ui/Icon';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';
import DestinationTile from '@/components/destinations/DestinationTile';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherSummary from '@/components/destinations/WeatherSummary';

const VIEWS = ['Photos', 'Table', 'Map'];
const ALL_REGIONS = 'All regions';

// "Gojal, Hunza, Gilgit-Baltistan" -> "Gilgit-Baltistan"
const provinceOf = (region) => region.split(',').at(-1).trim();

function Segmented({ options, value, onChange, label }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`h-8 rounded-[3px] px-3 text-[13px] ${value === o ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/5'}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function ConditionsTable({ destinations }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink text-[12px] text-muted">
            <th className="py-2 pr-4 font-medium">Destination</th>
            <th className="py-2 pr-4 font-medium">Crowd</th>
            <th className="py-2 pr-4 text-right font-medium">Check-ins / capacity</th>
            <th className="py-2 pr-4 font-medium">Safety</th>
            <th className="py-2 pr-4 font-medium">Weather</th>
            <th className="py-2 font-medium">Access</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.destinationId} className="border-b border-rule hover:bg-surface">
              <td className="py-3 pr-4">
                <Link href={`/destinations/${d.destinationId}`} className="font-medium hover:underline">{d.name}</Link>
                <span className="meta block">{d.region}</span>
              </td>
              <td className="py-3 pr-4"><CrowdLevel level={d.crowd.crowdLevel} /></td>
              <td className="py-3 pr-4 text-right data">{d.crowd.activeVisitors} / {d.crowd.capacityThreshold}</td>
              <td className="py-3 pr-4"><RiskStatus status={d.riskStatus} /></td>
              <td className="py-3 pr-4"><WeatherSummary weather={d.weather} compact /></td>
              <td className="py-3 text-ink-2">{d.accessInfo.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// UC-04 Explore Destinations, steps 1-3 (Expanded Use Case Table 41, SSD Fig. 23)
export default function DestinationExplorer({ initialSearch }) {
  const [search, setSearch] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [crowd, setCrowd] = useState('Any');
  const [province, setProvince] = useState(ALL_REGIONS);
  const [view, setView] = useState('Photos');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce typing before asking the server to search
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
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

  const provinces = useMemo(() => [...new Set(destinations.map((d) => provinceOf(d.region)))].sort(), [destinations]);

  const visible = useMemo(
    () => destinations.filter((d) =>
      (crowd === 'Any' || d.crowd.crowdLevel === crowd) &&
      (province === ALL_REGIONS || provinceOf(d.region) === province)),
    [destinations, crowd, province],
  );

  const filtered = search || crowd !== 'Any' || province !== ALL_REGIONS;
  const clearFilters = () => {
    setSearch('');
    setCrowd('Any');
    setProvince(ALL_REGIONS);
  };

  return (
    <div className="page pb-20">
      <PageTitle title="Destinations">
        Crowd levels come from active check-ins, safety status from verified reports. Open a destination for the
        weather, road access and hazard details.
      </PageTitle>

      <div className="flex flex-col gap-4 border-b border-rule py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-md flex-1 items-center gap-2 border-b border-ink/40 focus-within:border-ink">
          <Icon name="search" className="text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, region or attraction"
            aria-label="Search destinations"
            className="h-10 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            aria-label="Filter by region"
            className="h-8 rounded-[3px] border border-rule bg-surface px-2 text-[13px] text-ink-2 focus:border-ink focus:outline-none"
          >
            {[ALL_REGIONS, ...provinces].map((p) => <option key={p}>{p}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className="meta">Crowd</span>
            <Segmented options={['Any', ...CROWD_LEVELS]} value={crowd} onChange={setCrowd} label="Filter by crowd level" />
          </div>
          <Segmented options={VIEWS} value={view} onChange={setView} label="View" />
        </div>
      </div>

      <p className="meta py-4">
        {loading ? 'Loading…' : `${visible.length} destination${visible.length === 1 ? '' : 's'}`}
      </p>

      {error ? (
        <Notice tone="error">{error}</Notice>
      ) : loading ? null : visible.length === 0 ? (
        // UC-04 alt 3a
        <div className="py-16">
          <p className="font-display text-[26px]">No destinations found</p>
          <p className="mt-2 text-ink-2">Try another name, or clear the filters.</p>
          {filtered && (
            <button onClick={clearFilters} className="btn btn-secondary mt-5">
              Clear search and filters
            </button>
          )}
        </div>
      ) : view === 'Map' ? (
        <DestinationMap destinations={visible} height={560} />
      ) : view === 'Table' ? (
        <ConditionsTable destinations={visible} />
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => <DestinationTile key={d.destinationId} destination={d} />)}
        </div>
      )}
    </div>
  );
}
