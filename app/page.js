import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import AlertCard from '@/components/AlertCard';
import CrowdBadge from '@/components/CrowdBadge';
import { DESTINATIONS } from '@/data/destinations';
import { SAFETY_ALERTS } from '@/data/safetyAlerts';
import { FYP_INFO } from '@/data/teamData';
import Link from 'next/link';

export default function Home() {
  const featuredDestinations = DESTINATIONS.slice(0, 4);
  const activeAlerts = SAFETY_ALERTS.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <Navbar />

      <main className="flex-1">
        
        {/* ========================================== */}
        {/* HERO SECTION - Luxury Alpine Dark Emerald & Bronze */}
        {/* ========================================== */}
        <section className="relative bg-[#05100C] text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Mesh Overlay & Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#05100C] via-[#0D241C] to-[#040C09] opacity-95"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1800&auto=format&fit=crop')` }}
          ></div>
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4A373]/40 text-[#D4A373] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse"></span>
                <span>Northern Pakistan Real-Time GIS Telemetry</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
                Explore Northern Pakistan <span className="italic text-[#D4A373] font-normal">Uncrowded</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
                RAAAH monitors live tourist density, highway bottlenecks, and mountain hazards across Hunza, Naran, Skardu, Swat, and Murree. Travel smarter with AI-assisted density forecasting.
              </p>

              {/* Glassmorphic Search Bar */}
              <div className="glass-card-dark p-2.5 rounded-2xl shadow-2xl max-w-2xl">
                <form action="/destinations" className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 flex items-center px-4 py-1">
                    <span className="material-symbols-outlined text-[#D4A373] text-2xl mr-3">search</span>
                    <input
                      type="text"
                      name="search"
                      placeholder="Search destination (e.g. Hunza Valley, Saif-ul-Malook, Skardu)..."
                      className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#E8B931] hover:from-[#E8B931] hover:to-[#D4A373] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center space-x-2 shrink-0"
                  >
                    <span>Check Live Density</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </form>
              </div>

              {/* Stats Counter Bar */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-white/10 text-xs">
                <div>
                  <span className="block text-3xl font-bold text-[#D4A373] font-mono">31,700+</span>
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-semibold">Active Tourists</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-emerald-400 font-mono">5 Regions</span>
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-semibold">GIS Monitored</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-red-400 font-mono">2 Active</span>
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-semibold">Road Hazards</span>
                </div>
              </div>
            </div>

            {/* Right Live Density Widget */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="glass-card-dark p-7 rounded-3xl space-y-6 shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold flex items-center space-x-2">
                    <span className="material-symbols-outlined text-lg">radar</span>
                    <span>Live Region Telemetry</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE</span>
                  </span>
                </div>

                <div className="space-y-3.5">
                  {DESTINATIONS.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                        <span className="text-[11px] text-slate-400">{item.liveVisitors.toLocaleString()} tourists on site</span>
                      </div>
                      <CrowdBadge level={item.crowdLevel} score={item.crowdScore} size="sm" />
                    </div>
                  ))}
                </div>

                <Link
                  href="/crowd-map"
                  className="block w-full text-center py-3 rounded-xl bg-white text-[#05100C] font-bold text-xs hover:bg-[#D4A373] transition-colors shadow-md uppercase tracking-wider"
                >
                  Inspect Live GIS Heatmap →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* ROAD HAZARD ADVISORY BANNER */}
        {/* ========================================== */}
        <section className="bg-red-950/90 text-red-100 py-4 px-4 sm:px-6 lg:px-8 border-y border-red-800/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-red-400 text-2xl shrink-0">warning</span>
              <div>
                <strong className="font-bold text-red-200 uppercase tracking-wide mr-2">Disaster Alert:</strong> Landslide blockage reported on Karakoram Highway (Aliabad to Passu Bypass). NHA clearance in progress.
              </div>
            </div>
            <Link
              href="/safety"
              className="shrink-0 px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-colors uppercase tracking-wider shadow-xs"
            >
              View Advisories
            </Link>
          </div>
        </section>

        {/* ========================================== */}
        {/* FEATURED DESTINATIONS CATALOG */}
        {/* ========================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8E4] pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#164E3D] uppercase block mb-1">
                Real-Time Corridor Telemetry
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#0C1814]">
                Top Northern Pakistan Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#164E3D] hover:text-black transition-colors"
            >
              <span>Explore All Destinations ({DESTINATIONS.length})</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* ARCHITECTURE & FEATURES SHOWCASE */}
        {/* ========================================== */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8E4]">
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#164E3D]">
                Data-Driven Smart Tourism Platform
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#0C1814]">
                Engineered for Northern Pakistan Corridors
              </h2>
              <p className="text-xs sm:text-sm text-[#52635D] leading-relaxed">
                Combining live satellite telemetry, toll-plaza density sensors, crowdsourced driver reports, and emergency helpline services to preserve Northern ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E4] space-y-4 hover:border-[#164E3D] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#0D241C] text-[#D4A373] flex items-center justify-center font-bold text-xl shadow-md">
                  <span className="material-symbols-outlined text-2xl">sensors</span>
                </div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#0C1814]">
                  1. Live Crowd Density Tracking
                </h3>
                <p className="text-xs text-[#52635D] leading-relaxed">
                  Real-time density indicators classify tourist hot-spots into Low, Moderate, High, or Critical capacity levels before you arrive.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E4] space-y-4 hover:border-[#164E3D] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#0D241C] text-[#D4A373] flex items-center justify-center font-bold text-xl shadow-md">
                  <span className="material-symbols-outlined text-2xl">alt_route</span>
                </div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#0C1814]">
                  2. Smart Route & Hour Guidance
                </h3>
                <p className="text-xs text-[#52635D] leading-relaxed">
                  Avoid traffic bottlenecks at Babu Sar Pass or Murree Expressway with AI recommendations for off-peak visiting hours.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E4] space-y-4 hover:border-[#164E3D] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#0D241C] text-[#D4A373] flex items-center justify-center font-bold text-xl shadow-md">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#0C1814]">
                  3. Emergency & Disaster Alerts
                </h3>
                <p className="text-xs text-[#52635D] leading-relaxed">
                  Instant road blockage notifications linked directly to Rescue 1122 and District Disaster Authorities across Gilgit-Baltistan & KP.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* ACTIVE HAZARD ALERTS SHOWCASE */}
        {/* ========================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-red-700 uppercase block mb-1">
                Road Hazards & Advisory Log
              </span>
              <h2 className="font-serif-editorial text-3xl font-bold text-[#0C1814]">
                Current Disaster Advisories
              </h2>
            </div>
            <Link
              href="/safety"
              className="text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors"
            >
              All Advisories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* FAST-NUCES ACADEMIC BANNER */}
        {/* ========================================== */}
        <section className="bg-[#05100C] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4A373]">
                FAST-NUCES Final Year Project Defense • 2026
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">
                {FYP_INFO.title}
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl">
                Supervised by <strong>{FYP_INFO.supervisor.name}</strong> • Lead Architect: <strong>Abdur Rafay Baig (23F-3046)</strong> • M Ammar Ahmad (23P-3071) • Faiza Ali (23F-0739).
              </p>
            </div>
            <Link
              href="/about"
              className="px-7 py-3.5 rounded-xl bg-[#D4A373] hover:bg-[#E8B931] text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg"
            >
              Meet Team & Documentation →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
