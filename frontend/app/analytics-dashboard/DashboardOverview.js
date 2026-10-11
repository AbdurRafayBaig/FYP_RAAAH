"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { CROWD_COLORS, CROWD_LEVELS } from '@/constants/crowdLevels';
import { RISK_LEVELS } from '@/constants/riskLevels';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';
import CrowdLevel from '@/components/ui/CrowdLevel';
import RiskStatus from '@/components/ui/RiskStatus';

function Figure({ label, value, note }) {
  return (
    <div className="border-rule py-5 sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0">
      <p className="meta">{label}</p>
      <p className="mt-1 font-mono text-[32px] leading-tight">{value}</p>
      {note && <p className="meta mt-1">{note}</p>}
    </div>
  );
}

// Aggregated view built from live destination data (FR-10.02, FR-10.06).
// Tourist totals, report review and recommendation trends come with the full dashboard (UC-17).
export default function DashboardOverview() {
  const [destinations, setDestinations] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listDestinations().then(({ destinations }) => setDestinations(destinations)).catch((err) => setError(err.message));
  }, []);

  const stats = useMemo(() => {
    if (!destinations) return null;
    const count = (fn) => destinations.filter(fn).length;
    return {
      checkIns: destinations.reduce((sum, d) => sum + d.crowd.activeVisitors, 0),
      busy: count((d) => d.crowd.crowdLevel === 'High' || d.crowd.crowdLevel === 'Critical'),
      atRisk: count((d) => d.riskStatus !== 'Low Risk'),
      byCrowd: CROWD_LEVELS.map((l) => [l, count((d) => d.crowd.crowdLevel === l)]),
      byRisk: RISK_LEVELS.map((r) => [r, count((d) => d.riskStatus === r)]),
      sorted: [...destinations].sort(
        (a, b) => b.crowd.activeVisitors / b.crowd.capacityThreshold - a.crowd.activeVisitors / a.crowd.capacityThreshold,
      ),
    };
  }, [destinations]);

  return (
    <div className="page pb-20">
      <PageTitle title="Overview">
        Live crowd and safety picture across registered destinations. Totals only — no individual is ever shown.
      </PageTitle>

      {error && <Notice tone="error" className="mt-6">{error}</Notice>}
      {!stats && !error && <p className="meta py-10">Loading…</p>}

      {stats && (
        <>
          <section className="grid border-b border-rule sm:grid-cols-2 lg:grid-cols-4">
            <Figure label="Destinations" value={destinations.length} />
            <Figure label="Active check-ins" value={stats.checkIns} note="Right now, all destinations" />
            <Figure label="High or critical crowd" value={stats.busy} />
            <Figure label="Elevated or high risk" value={stats.atRisk} />
          </section>

          <section className="grid gap-10 border-b border-rule py-10 md:grid-cols-2">
            <div>
              <h2 className="text-[22px]">Destinations by crowd level</h2>
              <div className="mt-4 flex h-3 overflow-hidden" aria-hidden="true">
                {stats.byCrowd.map(([l, n]) => n > 0 && (
                  <span key={l} style={{ flexGrow: n, backgroundColor: CROWD_COLORS[l] }} />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {stats.byCrowd.map(([l, n]) => (
                  <li key={l} className="flex justify-between text-[14px]"><CrowdLevel level={l} /><span className="data">{n}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[22px]">Destinations by risk status</h2>
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {stats.byRisk.map(([r, n]) => (
                  <li key={r} className="flex justify-between py-2.5 text-[14px]"><RiskStatus status={r} /><span className="data">{n}</span></li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-10">
            <h2 className="text-[22px]">Busiest first</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-ink text-[12px] text-muted">
                    <th className="py-2 pr-4 font-medium">Destination</th>
                    <th className="py-2 pr-4 font-medium">Load</th>
                    <th className="py-2 pr-4 text-right font-medium">Check-ins / capacity</th>
                    <th className="py-2 font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sorted.map((d) => {
                    const ratio = d.crowd.activeVisitors / d.crowd.capacityThreshold;
                    return (
                      <tr key={d.destinationId} className="border-b border-rule">
                        <td className="py-2.5 pr-4"><Link href={`/destinations/${d.destinationId}`} className="hover:underline">{d.name}</Link></td>
                        <td className="w-[34%] py-2.5 pr-4">
                          <div className="h-1.5 bg-rule">
                            <div className="h-full" style={{ width: `${Math.min(100, ratio * 100)}%`, backgroundColor: CROWD_COLORS[d.crowd.crowdLevel] }} />
                          </div>
                        </td>
                        <td className="data py-2.5 pr-4 text-right">{d.crowd.activeVisitors} / {d.crowd.capacityThreshold}</td>
                        <td className="py-2.5"><RiskStatus status={d.riskStatus} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="meta mt-4">
              Registered tourist totals, hazard report review and recommendation trends are part of the full dashboard,
              planned for the next phase.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
