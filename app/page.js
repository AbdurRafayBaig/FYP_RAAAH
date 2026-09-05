import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import CrowdBadge from '@/components/CrowdBadge';
import SafetyBadge from '@/components/SafetyBadge';
import { DESTINATIONS } from '@/data/destinations';
import { SAFETY_ALERTS } from '@/data/safetyAlerts';
import Link from 'next/link';

export default function Home() {
  const featuredDestinations = DESTINATIONS.slice(0, 4);
  const activeAlerts = SAFETY_ALERTS.filter(a => a.status === 'Verified' || a.status === 'Under Review');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1">
        
        {/* ========================================== */}
        {/* HERO SECTION - Clean Northern Tourism Hero */}
        {/* ========================================== */}
        <section className="bg-[#164A41] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Text & Search */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2F6B5B] text-stone-100 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#D9B77A]"></span>
                <span>Northern Pakistan Travel & Safety Guide</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Explore Northern Pakistan <br className="hidden sm:inline" />
                <span className="text-[#D9B77A]">with confidence.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed">
                Check crowd levels, weather and safety conditions before you travel.
              </p>

              {/* Simple Search Input */}
              <div className="bg-white p-2 rounded-xl shadow-sm max-w-2xl border border-stone-200">
                <form action="/destinations" className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 flex items-center px-3 py-1">
                    <span className="material-symbols-outlined text-stone-400 text-xl mr-2">search</span>
                    <input
                      type="text"
                      name="search"
                      placeholder="Search destinations (e.g. Hunza, Skardu, Naran)..."
                      className="w-full bg-transparent border-none text-[#17211F] placeholder-stone-400 text-sm font-medium focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#164A41] hover:bg-[#2F6B5B] text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center space-x-1"
                  >
                    <span>Explore Destinations</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Current Condition Summary Box */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white text-[#17211F] p-5 rounded-xl space-y-4 border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-bold text-[#164A41] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Current Conditions</span>
                  </span>
                  <span className="text-[11px] text-[#66736F]">Updated 10m ago</span>
                </div>

                <div className="space-y-3">
                  {DESTINATIONS.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8F5] border border-stone-200 text-xs">
                      <div>
                        <h4 className="font-bold text-[#17211F]">{item.name}</h4>
                        <span className="text-[11px] text-[#66736F]">{item.weather?.temp} · {item.weather?.condition}</span>
                      </div>
                      <CrowdBadge level={item.crowdLevel} size="sm" />
                    </div>
                  ))}
                </div>

                <Link
                  href="/destinations"
                  className="block w-full text-center py-2.5 rounded-lg bg-[#F7F8F5] hover:bg-[#164A41] hover:text-white border border-stone-200 text-[#164A41] font-semibold text-xs transition-colors"
                >
                  View All Conditions →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* PLAN BEFORE YOU GO (3 Utility Blocks) */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F]">
              Plan before you go
            </h2>
            <p className="text-xs sm:text-sm text-[#66736F]">
              RAAAH brings together real-time signals so you can travel informed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="raah-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5F0] text-[#2E7D5B] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
              <h3 className="text-base font-bold text-[#17211F]">Crowd Levels</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                See how busy a destination is right now so you can avoid traffic and enjoy your stay.
              </p>
            </div>

            <div className="raah-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF8EC] text-[#C68A19] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">partly_cloudy_day</span>
              </div>
              <h3 className="text-base font-bold text-[#17211F]">Weather Conditions</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Check mountain temperatures, precipitation, and road passability before driving.
              </p>
            </div>

            <div className="raah-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FDF2F0] text-[#D65A4A] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">shield_heart</span>
              </div>
              <h3 className="text-base font-bold text-[#17211F]">Active Hazards</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Know about verified landslides, road blockages, or severe weather alerts on your route.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* POPULAR DESTINATIONS */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider block mb-1">
                Explore Northern Pakistan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F]">
                Popular Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#164A41] hover:underline"
            >
              <span>View all destinations ({DESTINATIONS.length})</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* CURRENT SAFETY INFORMATION */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D65A4A] uppercase tracking-wider block">
                  Travel Safety
                </span>
                <h3 className="text-xl font-bold text-[#17211F]">
                  Current Safety Information
                </h3>
              </div>
              <Link
                href="/safety"
                className="px-4 py-2 rounded-lg bg-[#F7F8F5] hover:bg-stone-200 border border-stone-200 text-[#17211F] text-xs font-semibold transition-colors shrink-0 text-center"
              >
                View all safety information →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg bg-[#F7F8F5] border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17211F]">{alert.title}</span>
                    <SafetyBadge status={alert.severity === 'Critical' ? 'High Risk' : 'Elevated Risk'} />
                  </div>
                  <p className="text-xs text-[#66736F] leading-relaxed">
                    {alert.location}: {alert.description}
                  </p>
                  <span className="text-[11px] text-[#66736F] block font-mono">
                    Updated: {alert.updatedAt || 'Today'} · Verified Report
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* HUMANIZED ALTERNATIVES ("Looking for a quieter alternative?") */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
          <div className="bg-[#EBF5F0] p-6 sm:p-8 rounded-xl border border-[#B6E0CF] space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2E7D5B] uppercase tracking-wider block">
                Travel Recommendations
              </span>
              <h3 className="text-2xl font-extrabold text-[#164A41]">
                Looking for a quieter alternative?
              </h3>
              <p className="text-xs sm:text-sm text-[#17211F] max-w-2xl leading-relaxed">
                When popular spots like Naran or Central Hunza experience high visitor numbers, RAAAH suggests peaceful, scenic alternatives nearby.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#17211F] text-base">Shigar Valley</h4>
                  <CrowdBadge level="Low" size="sm" />
                </div>
                <p className="text-xs text-[#66736F]">
                  A serene alternative near Skardu with rich heritage, fruit orchards, and lower visitor traffic.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Lower Crowd</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Low Risk</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Heritage & Nature</span>
                </div>
                <Link href="/destinations/shigar" className="inline-block text-xs font-bold text-[#164A41] hover:underline pt-1">
                  Explore Shigar Valley →
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#17211F] text-base">Naltar Valley</h4>
                  <CrowdBadge level="Low" size="sm" />
                </div>
                <p className="text-xs text-[#66736F]">
                  Famous for its vibrant lakes and pine forests. Quiet visitor levels with pleasant mountain weather.
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Good Weather</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Low Risk</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7F8F5] text-[11px] text-[#2F6B5B] font-medium border border-stone-200">Nature & Adventure</span>
                </div>
                <Link href="/destinations/naltar" className="inline-block text-xs font-bold text-[#164A41] hover:underline pt-1">
                  Explore Naltar Valley →
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* TRAVEL RESPONSIBLY */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-[#17211F]">
              Travel Responsibly
            </h2>
            <p className="text-xs text-[#66736F]">
              Help preserve the pristine environment and respect local traditions across Northern Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#66736F]">
            <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#17211F] block text-sm">Respect Local Customs</span>
              <p>Dress modestly and seek permission before photographing local residents and religious sites.</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#17211F] block text-sm">Keep It Clean</span>
              <p>Carry your trash out with you and avoid plastic waste in pristine alpine valleys and rivers.</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-1.5">
              <span className="font-bold text-[#17211F] block text-sm">Support Local Communities</span>
              <p>Hire local guides, stay in community-run lodges, and buy authentic local handicrafts.</p>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* ABOUT RAAAH QUICK SUMMARY */}
        {/* ========================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B5B]">
                About RAAAH
              </span>
              <h3 className="text-xl font-bold text-[#17211F]">
                Helping travellers make informed decisions across Northern Pakistan.
              </h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Tourists often face limited information about crowd density, weather shifts, and road hazards before leaving. RAAAH brings these signals together to help you travel safer and smoother.
              </p>
            </div>
            <Link
              href="/about"
              className="px-5 py-2.5 rounded-lg bg-[#164A41] hover:bg-[#2F6B5B] text-white font-semibold text-xs shrink-0 transition-colors"
            >
              Learn More About Us →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
