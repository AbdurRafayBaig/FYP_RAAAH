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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        
        {/* ========================================== */}
        {/* HERO SECTION - Fresh, Light, High-Contrast */}
        {/* ========================================== */}
        <section className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Text & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Northern Pakistan Smart Tourism Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Plan Your Northern Trip <br className="hidden sm:inline" />
                <span className="text-amber-400">Without Traffic & Crowds</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed font-normal">
                Check real-time tourist density, highway land-slides, and hotel vacancies across Hunza, Naran, Skardu, Swat, and Murree.
              </p>

              {/* Simple Search Input */}
              <div className="bg-white p-2 rounded-2xl shadow-xl max-w-2xl border border-gray-200">
                <form action="/destinations" className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 flex items-center px-3 py-1">
                    <span className="material-symbols-outlined text-gray-400 text-2xl mr-2">search</span>
                    <input
                      type="text"
                      name="search"
                      placeholder="Where do you want to travel? (e.g. Hunza, Naran, Skardu)..."
                      className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
                  >
                    <span>Check Density</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </form>
              </div>

              {/* Stats Counters */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-emerald-800/80 text-xs">
                <div>
                  <span className="block text-2xl font-black text-amber-400 font-mono">31,700+</span>
                  <span className="text-emerald-200 uppercase tracking-wide text-[10px] font-semibold">Active Tourists</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-emerald-300 font-mono">5 Regions</span>
                  <span className="text-emerald-200 uppercase tracking-wide text-[10px] font-semibold">Live Monitored</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-red-300 font-mono">2 Advisories</span>
                  <span className="text-emerald-200 uppercase tracking-wide text-[10px] font-semibold">Road Hazards</span>
                </div>
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white text-gray-900 p-6 rounded-3xl space-y-5 shadow-2xl border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold flex items-center space-x-2">
                    <span className="material-symbols-outlined text-lg">sensors</span>
                    <span>Live Crowd Summary</span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">Updated 1m ago</span>
                </div>

                <div className="space-y-3">
                  {DESTINATIONS.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                        <span className="text-xs text-gray-600">{item.liveVisitors.toLocaleString()} tourists on site</span>
                      </div>
                      <CrowdBadge level={item.crowdLevel} score={item.crowdScore} size="sm" />
                    </div>
                  ))}
                </div>

                <Link
                  href="/crowd-map"
                  className="block w-full text-center py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-md uppercase tracking-wider"
                >
                  Open Live GIS Crowd Map →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* HAZARD WARNING BANNER */}
        {/* ========================================== */}
        <section className="bg-red-50 text-red-900 py-3.5 px-4 sm:px-6 lg:px-8 border-y border-red-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-2.5">
              <span className="material-symbols-outlined text-red-700 text-xl shrink-0">warning</span>
              <div>
                <strong className="font-bold uppercase tracking-wide text-red-800 mr-2">Road Warning:</strong> Landslide blockage reported on KKH (Aliabad to Passu Bypass). NHA clearance in progress.
              </div>
            </div>
            <Link
              href="/safety"
              className="shrink-0 px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              Safety Advisories
            </Link>
          </div>
        </section>

        {/* ========================================== */}
        {/* DESTINATION GRID */}
        {/* ========================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase block mb-1">
                Real-Time Corridor Status
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Top Northern Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>View All ({DESTINATIONS.length})</span>
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
        {/* HOW IT WORKS */}
        {/* ========================================== */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-800">
                User-Friendly Smart Tourism
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                How RAAAH Helps You Travel Safely
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Clear, real-time metrics designed to keep your family trip safe, convenient, and un-crowded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-2xl">sensors</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">1. Live Density Badges</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Know before you travel if a spot is Low, Moderate, High, or Overcrowded.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-2xl">alt_route</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">2. Best Visit Hours</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Avoid 2-hour traffic jams at Babu Sar Pass with recommended off-peak visiting windows.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">3. Emergency Rescue</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Instant road alerts linked directly to Rescue 1122 and District Authorities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* ACTIVE HAZARD ALERTS */}
        {/* ========================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-red-700 uppercase block mb-1">
                Disaster & Hazard Notices
              </span>
              <h2 className="text-2xl font-black text-gray-900">
                Active Road Advisories
              </h2>
            </div>
            <Link
              href="/safety"
              className="text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors"
            >
              All Advisories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* FYP ACADEMIC BANNER */}
        {/* ========================================== */}
        <section className="bg-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-emerald-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                FAST-NUCES Final Year Project 2026
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                {FYP_INFO.title}
              </h3>
              <p className="text-xs text-emerald-200">
                Supervised by {FYP_INFO.supervisor.name} • FYP Team: Abdur Rafay Baig (23F-3046), M Ammar Ahmad (23P-3071), Faiza Ali (23F-0739).
              </p>
            </div>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md"
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
