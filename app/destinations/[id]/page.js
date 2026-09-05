import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrowdBadge from '@/components/CrowdBadge';
import SafetyBadge from '@/components/SafetyBadge';
import AccommodationCard from '@/components/AccommodationCard';
import { DESTINATIONS } from '@/data/destinations';
import { ACCOMMODATIONS } from '@/data/accommodations';
import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({ params }) {
  const { id } = await params;
  const destination = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];

  const nearbyHotels = ACCOMMODATIONS.filter(h => 
    h.location.toLowerCase().includes(destination.name.split(' ')[0].toLowerCase()) ||
    h.location.toLowerCase().includes('hunza')
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 pb-16">
        
        {/* ========================================== */}
        {/* EDITORIAL HERO BANNER - Matching Stitch Hunza Details */}
        {/* ========================================== */}
        <section className="relative h-[480px] w-full bg-[#041627] text-white">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041627] via-[#041627]/60 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Link href="/destinations" className="hover:underline">Destinations</Link>
              <span>/</span>
              <span>{destination.region}</span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {destination.name}
            </h1>

            <p className="text-base sm:text-xl text-slate-200 font-light max-w-2xl">
              {destination.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CrowdBadge level={destination.crowdLevel} score={destination.crowdScore} size="lg" />
              <SafetyBadge status={destination.safetyStatus} />
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center space-x-1 border border-white/20">
                <span className="material-symbols-outlined text-amber-400 text-base">{destination.weather.icon}</span>
                <span>{destination.weather.temp} • {destination.weather.condition}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* DENSITY & VISITOR ANALYTICS DASHBOARD */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E3DC] shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Real-time Capacity Gauge */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-[#F0EEE9] pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0051D5]">
                  Real-Time Capacity Monitor
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Live Sensor Feed</span>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-3xl font-bold font-mono text-[#041627]">
                    {destination.crowdScore}%
                  </span>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {destination.capacityStatus}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000"
                    style={{ width: `${destination.crowdScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">Active Footfall</span>
                  <strong className="text-slate-900 text-sm font-mono">{destination.liveVisitors.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">Threshold Capacity</span>
                  <strong className="text-slate-900 text-sm font-mono">{destination.maxCapacity.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* AI Recommendation Slot */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900">
                  <span className="material-symbols-outlined text-emerald-700 text-xl">auto_awesome</span>
                  <h3 className="font-serif-editorial text-lg font-bold">
                    Recommended Visit Window
                  </h3>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  To avoid 2-hour queue delays at Altit Fort and Eagle&apos;s Nest, RAAAH AI recommends visiting during: <strong>{destination.recommendedVisitTime}</strong>.
                </p>
                <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                  Peak Busy Window: {destination.peakHours}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* DESTINATION HIGHLIGHTS & DETAILS */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif-editorial text-3xl font-bold text-[#041627]">
                  About {destination.name}
                </h2>
                <p className="text-sm text-[#575A60] leading-relaxed text-justify">
                  {destination.description}
                </p>
              </div>

              {/* Key Attractions */}
              <div className="space-y-4">
                <h3 className="font-serif-editorial text-2xl font-bold text-[#041627]">
                  Must-Visit Landmarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-[#E5E3DC] flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-[#041627] text-white flex items-center justify-center font-bold text-xs">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Gallery Grid */}
              <div className="space-y-4 pt-4">
                <h3 className="font-serif-editorial text-2xl font-bold text-[#041627]">
                  Visual Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.gallery.map((imgUrl, i) => (
                    <div key={i} className="relative h-48 rounded-2xl overflow-hidden border border-slate-200">
                      <Image src={imgUrl} alt={`${destination.name} gallery ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Quick Info Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E5E3DC] space-y-4 shadow-sm">
                <h3 className="font-serif-editorial text-xl font-bold text-[#041627] border-b border-[#F0EEE9] pb-3">
                  Travel Essentials
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0EEE9]">
                    <span className="text-slate-500">Best Season:</span>
                    <strong className="text-slate-900">{destination.bestTimeToVisit}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0EEE9]">
                    <span className="text-slate-500">Peak Hours:</span>
                    <strong className="text-amber-700">{destination.peakHours}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0EEE9]">
                    <span className="text-slate-500">Accommodations:</span>
                    <strong className="text-slate-900">{destination.accommodationsAvailable} Eco Lodges</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Coordinates:</span>
                    <strong className="font-mono text-slate-900">{destination.coordinates.lat}°N, {destination.coordinates.lng}°E</strong>
                  </div>
                </div>

                <Link
                  href="/crowd-map"
                  className="block w-full text-center py-3 rounded-xl bg-[#041627] text-white font-semibold text-xs hover:bg-[#003120] transition-colors"
                >
                  Locate on Live GIS Map →
                </Link>
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* NEARBY ACCOMMODATIONS LISTING */}
          {/* ========================================== */}
          <div className="space-y-6 pt-12 border-t border-[#E5E3DC]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0051D5]">
                Verified Lodgings & Availability
              </span>
              <h2 className="font-serif-editorial text-3xl font-bold text-[#041627]">
                Accommodations Near {destination.name}
              </h2>
            </div>

            <div className="space-y-6">
              {nearbyHotels.map((hotel) => (
                <AccommodationCard key={hotel.id} item={hotel} />
              ))}
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
