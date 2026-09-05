import AdminSidebar from '@/components/AdminSidebar';
import { DESTINATIONS } from '@/data/destinations';
import { SAFETY_ALERTS } from '@/data/safetyAlerts';

export default function AnalyticsDashboardPage() {
  const highCrowdCount = DESTINATIONS.filter(d => d.crowdLevel === 'High' || d.crowdLevel === 'Critical').length;

  return (
    <div className="min-h-screen flex bg-[#F7F8F5]">
      <AdminSidebar title="Tourism Analytics" />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider block">
              Admin Dashboard
            </span>
            <h1 className="text-2xl font-extrabold text-[#17211F]">
              Tourism Overview
            </h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#164A41] text-white text-xs font-semibold hover:bg-[#2F6B5B] transition-colors">
            Export Report (PDF)
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Registered Tourists</span>
            <span className="text-2xl font-bold text-[#17211F] block">2,481</span>
            <span className="text-[11px] text-[#2E7D5B] font-medium">+12% this month</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Active Destinations</span>
            <span className="text-2xl font-bold text-[#17211F] block">{DESTINATIONS.length}</span>
            <span className="text-[11px] text-[#66736F]">Across 3 regions</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Safety Reports</span>
            <span className="text-2xl font-bold text-[#D65A4A] block">{SAFETY_ALERTS.length}</span>
            <span className="text-[11px] text-[#66736F]">Active advisories</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">High Crowd Destinations</span>
            <span className="text-2xl font-bold text-[#C68A19] block">{highCrowdCount}</span>
            <span className="text-[11px] text-[#66736F]">Above moderate threshold</span>
          </div>

        </div>

        {/* Crowd Distribution */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#17211F]">
            Crowd Distribution by Destination
          </h2>

          <div className="space-y-3 pt-2">
            {DESTINATIONS.slice(0, 5).map((dest) => {
              const pct = dest.crowdScore || 50;
              let barColor = '#2E7D5B';
              if (pct > 80) barColor = '#D65A4A';
              else if (pct > 60) barColor = '#C68A19';
              
              return (
                <div key={dest.id}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#17211F]">{dest.name} ({dest.region})</span>
                    <span className="text-[#66736F] font-mono">{dest.liveVisitors?.toLocaleString()} visitors · {pct}% capacity</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Reports Table */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#17211F]">
            Safety Reports
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F5] text-[#17211F] font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Hazard</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {SAFETY_ALERTS.map((alert) => {
                  let sevColor = '#2E7D5B';
                  if (alert.severity.includes('High')) sevColor = '#D65A4A';
                  else if (alert.severity.includes('Elevated')) sevColor = '#C68A19';
                  
                  return (
                    <tr key={alert.id}>
                      <td className="p-3 font-semibold text-[#17211F]">{alert.title}</td>
                      <td className="p-3 text-[#66736F]">{alert.region}</td>
                      <td className="p-3">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{ color: sevColor, backgroundColor: sevColor + '15' }}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-3 text-[#66736F]">{alert.status}</td>
                      <td className="p-3 text-[#66736F]">{alert.timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
