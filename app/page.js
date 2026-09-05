import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import AlertCard from '@/components/AlertCard';
import CrowdBadge from '@/components/CrowdBadge';
import { DESTINATIONS } from '@/data/destinations';
import { SAFETY_ALERTS, EMERGENCY_CONTACTS } from '@/data/safetyAlerts';
import { FYP_INFO } from '@/data/teamData';
import Link from 'next/link';

export default function Home() {
  const featuredDestinations = DESTINATIONS.slice(0, 4);
  const activeAlerts = SAFETY_ALERTS.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1">
        {/* ========================================== */}
        {/* HERO SECTION - Stitch Editorial Alpine Style */}
        {/* ========================================== */}
        <section className="relative bg-[#041627] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Gradient & Mountain Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041627] via-[#041627]/90 to-emerald-950/60 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1600&auto=format&fit=crop')` }}
          ></div>

          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Real-Time Northern Pakistan Crowd Tracking</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                Explore Northern Pakistan Without the Crowds
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                RAAAH monitors live tourist density, highway bottlenecks, and weather hazards across Hunza, Naran, Skardu, Swat, and Murree. Plan safer journeys with AI-driven visit recommendations.
              </p>

              {/* Search Bar */}
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl max-w-xl">
                <form action="/destinations" className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 flex items-center px-3">
                    <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
                    <input
                      type="text"
                      name="search"
                      placeholder="Where are you travelling? (e.g. Hunza, Naran, Skardu)..."
                      className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>Check Density</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </form>
              </div>

              {/* Live Metric Stats Bar */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-xs">
                <div>
                  <span className="block text-2xl font-bold text-amber-400 font-mono">31,700+</span>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Tourists</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-emerald-400 font-mono">5 Regions</span>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Live Monitored</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-red-400 font-mono">2 Road Alerts</span>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Hazards</span>
                </div>
              </div>
            </div>

            {/* Quick Status Floating Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl space-y-5 shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-base">sensors</span>
                    <span>Live Region Density Summary</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Updated 1m ago</span>
                </div>

                <div className="space-y-3">
                  {DESTINATIONS.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                        <span className="text-[11px] text-slate-300">{item.liveVisitors.toLocaleString()} tourists on site</span>
                      </div>
                      <CrowdBadge level={item.crowdLevel} score={item.crowdScore} size="sm" />
                    </div>
                  ))}
                </div>

                <Link
                  href="/crowd-map"
                  className="block w-full text-center py-2.5 rounded-xl bg-white text-[#041627] font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Open Full GIS Crowd Map →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* ACTIVE HAZARD ALERT BANNER */}
        {/* ========================================== */}
        <section className="bg-amber-500/10 border-y border-amber-500/30 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-amber-950 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-amber-700 text-2xl shrink-0">warning</span>
              <div>
                <strong className="font-bold text-amber-900">TRAVEL ADVISORY:</strong> Landslide blockage reported on KKH (Aliabad to Passu Bypass). Clearances expected by 3:00 PM.
              </div>
            </div>
            <Link
              href="/safety"
              className="shrink-0 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
            >
              View Safety Advisories
            </Link>
          </div>
        </section>

        {/* ========================================== */}
        {/* POPULAR DESTINATIONS GRID */}
        {/* ========================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#0051D5] uppercase block mb-1">
                Real-Time Corridor Status
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#041627]">
                Top Northern Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-[#0051D5] hover:text-[#041627] transition-colors"
            >
              <span>View All Destinations ({DESTINATIONS.length})</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* HOW RAAAH SMART TOURISM WORKS */}
        {/* ========================================== */}
        <section className="bg-[#FAF9F8] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E3DC]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
                Data-Driven Travel Experience
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#041627]">
                How RAAAH Optimizes Your Journey
              </h2>
              <p className="text-sm text-[#575A60] leading-relaxed">
                Combining live satellite feedback, toll-plaza density sensors, crowdsourced tourist reports, and weather telemetry to preserve Northern Pakistan&apos;s fragile ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">sensors</span>
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-[#041627]">
                  1. Live Crowd Density Tracking
                </h3>
                <p className="text-xs text-[#575A60] leading-relaxed">
                  Real-time density indicators classify tourist hot-spots into Low, Moderate, High, or Critical capacity levels before you arrive.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">alt_route</span>
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-[#041627]">
                  2. Smart Route & Hour Guidance
                </h3>
                <p className="text-xs text-[#575A60] leading-relaxed">
                  Avoid traffic bottlenecks at Babu Sar Pass or Murree Expressway with AI recommendations for off-peak visiting hours.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-[#041627]">
                  3. Emergency & Disaster Alerts
                </h3>
                <p className="text-xs text-[#575A60] leading-relaxed">
                  Instant road blockage notifications linked directly to Rescue 1122 and District Disaster Authorities across Gilgit-Baltistan & KP.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* RECENT SAFETY ALERTS PREVIEW */}
        {/* ========================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-red-700 uppercase block mb-1">
                Disaster & Road Hazards
              </span>
              <h2 className="font-serif-editorial text-3xl font-bold text-[#041627]">
                Current Active Advisories
              </h2>
            </div>
            <Link
              href="/safety"
              className="text-xs font-semibold text-red-700 hover:text-red-900 transition-colors"
            >
              All Safety Alerts →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* FAST-NUCES FYP DECLARATION BANNER */}
        {/* ========================================== */}
        <section className="bg-[#041627] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Academic Project Attribution • FAST-NUCES 2026
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-white">
                {FYP_INFO.title}
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl">
                Supervised by <strong>{FYP_INFO.supervisor.name}</strong> • Built by <strong>Abdur Rafay Baig (23F-3046)</strong>, M Ammar Ahmad (23P-3071), & Faiza Ali (23F-0739).
              </p>
            </div>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-semibold text-xs shrink-0 transition-colors shadow-md"
            >
              Meet the FYP Team & Documentation →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
