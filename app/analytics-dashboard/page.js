import AdminSidebar from '@/components/AdminSidebar';

export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen flex bg-[#FAF9F8]">
      <AdminSidebar title="Authority Analytics" />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DC] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0051D5]">
              Gilgit-Baltistan & KP Tourism Management Authority
            </span>
            <h1 className="font-serif-editorial text-3xl font-bold text-[#041627]">
              Regional Tourism Analytics Dashboard
            </h1>
          </div>
          <button className="px-4 py-2 rounded-xl bg-[#041627] text-white text-xs font-semibold hover:bg-[#003120]">
            Export Official Report (PDF)
          </button>
        </div>

        {/* Authority Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Total Active Influx</span>
            <span className="text-3xl font-bold font-mono text-[#041627] block">31,700</span>
            <span className="text-[11px] text-emerald-700 font-semibold block">Across 5 Monitored Corridors</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Regional Capacity Utilized</span>
            <span className="text-3xl font-bold font-mono text-amber-700 block">74%</span>
            <span className="text-[11px] text-slate-500 block">Naran at 92% (Overcrowded)</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Active Road Hazards</span>
            <span className="text-3xl font-bold font-mono text-red-700 block">2</span>
            <span className="text-[11px] text-[#575A60] block">KKH KM 412 & Babusar Pass</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Sensor Network Status</span>
            <span className="text-3xl font-bold font-mono text-emerald-700 block">12 / 12</span>
            <span className="text-[11px] text-slate-500 block">100% Telemetry Online</span>
          </div>

        </div>

        {/* Region Influx Breakdown Bar Chart Simulation */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E3DC] shadow-sm space-y-4">
          <h2 className="font-serif-editorial text-xl font-bold text-[#041627]">
            Regional Tourist Footfall Breakdown
          </h2>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Hunza Valley (Gilgit-Baltistan)</span>
                <span className="font-mono">3,420 tourists (78% capacity)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Naran & Kaghan Valley (KP)</span>
                <span className="font-mono">8,900 tourists (92% capacity)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Skardu & Shangrila (GB)</span>
                <span className="font-mono">1,600 tourists (32% capacity)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Murree & Patriata (Punjab)</span>
                <span className="font-mono">12,400 tourists (84% capacity)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
