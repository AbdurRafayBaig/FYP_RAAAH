import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrowdBadge from '@/components/CrowdBadge';
import SafetyBadge from '@/components/SafetyBadge';
import { DESTINATIONS } from '@/data/destinations';
import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({ params }) {
  const { id } = await params;
  const destination = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];

  const alternatives = DESTINATIONS.filter(d => d.id !== destination.id).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 pb-16">
        
        {/* Destination Header Banner */}
        <section className="relative h-[380px] w-full bg-[#164A41] text-white">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#164A41] via-[#164A41]/40 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#D9B77A]">
              <Link href="/destinations" className="hover:underline">Destinations</Link>
              <span>/</span>
              <span>{destination.region}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {destination.name}
            </h1>

            <p className="text-sm sm:text-base text-stone-200 max-w-2xl">
              {destination.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CrowdBadge level={destination.crowdLevel} size="md" />
              <SafetyBadge status={destination.safetyStatus} />
              <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1 border border-white/20">
                <span className="material-symbols-outlined text-[#D9B77A] text-sm">{destination.weather?.icon || 'wb_sunny'}</span>
                <span>{destination.weather?.temp} · {destination.weather?.condition}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* About Section */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <h2 className="text-2xl font-bold text-[#17211F]">
                  About {destination.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#66736F] leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Current Conditions Summary */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="text-xl font-bold text-[#17211F]">
                  Current Conditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-[#F7F8F5] border border-stone-200 space-y-2">
                    <span className="text-[#66736F] font-semibold uppercase block text-[10px]">Crowd Level</span>
                    <CrowdBadge level={destination.crowdLevel} size="sm" />
                    <p className="text-[11px] text-[#66736F] pt-1">
                      {destination.crowdLevel === 'Low' ? 'Quiet visitor traffic currently.' : 'Busy visitor traffic.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F7F8F5] border border-stone-200 space-y-2">
                    <span className="text-[#66736F] font-semibold uppercase block text-[10px]">Weather</span>
                    <div className="font-bold text-[#17211F] text-sm">
                      {destination.weather?.temp} · {destination.weather?.condition}
                    </div>
                    <p className="text-[11px] text-[#66736F]">
                      Updated 12 minutes ago
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F7F8F5] border border-stone-200 space-y-2">
                    <span className="text-[#66736F] font-semibold uppercase block text-[10px]">Safety Status</span>
                    <SafetyBadge status={destination.safetyStatus} />
                    <p className="text-[11px] text-[#66736F] pt-1">
                      No active road blockages reported near site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Things to Explore */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="text-xl font-bold text-[#17211F]">
                  Things to Explore
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#F7F8F5] border border-stone-200 flex items-center space-x-3 text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#164A41] text-white flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[#17211F]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Gallery */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#17211F]">
                  Photos of {destination.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.gallery.map((imgUrl, i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden border border-stone-200">
                      <Image src={imgUrl} alt={`${destination.name} gallery image ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Essentials Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4 shadow-2xs">
                <h3 className="text-lg font-bold text-[#17211F] border-b border-stone-100 pb-3">
                  Travel Essentials
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-[#66736F]">Best Season:</span>
                    <strong className="text-[#17211F]">{destination.bestTimeToVisit}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-[#66736F]">Recommended Time:</span>
                    <strong className="text-[#164A41]">{destination.recommendedVisitTime || 'Morning'}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-[#66736F]">Region:</span>
                    <strong className="text-[#17211F]">{destination.region}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#66736F]">Coordinates:</span>
                    <strong className="font-mono text-[#17211F]">{destination.coordinates.lat}°N, {destination.coordinates.lng}°E</strong>
                  </div>
                </div>

                <Link
                  href="/safety"
                  className="block w-full text-center py-2.5 rounded-lg bg-[#164A41] text-white font-semibold text-xs hover:bg-[#2F6B5B] transition-colors"
                >
                  Check Route Safety →
                </Link>
              </div>

              {/* Responsible Tourism Box */}
              <div className="bg-[#EBF5F0] p-5 rounded-xl border border-[#B6E0CF] space-y-2 text-xs">
                <h4 className="font-bold text-[#164A41]">Travel Responsibly</h4>
                <p className="text-[#17211F] leading-relaxed">
                  Help protect {destination.name}&apos;s fragile alpine environment by packing out garbage and supporting local village vendors.
                </p>
              </div>
            </div>

          </div>

          {/* Recommended Alternatives */}
          <div className="pt-10 border-t border-stone-200 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider block">
                Planning Ahead
              </span>
              <h2 className="text-2xl font-bold text-[#17211F]">
                Looking for alternative destinations?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {alternatives.map((alt) => (
                <div key={alt.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#17211F] text-base">{alt.name}</h3>
                      <CrowdBadge level={alt.crowdLevel} size="sm" />
                    </div>
                    <p className="text-xs text-[#66736F]">{alt.tagline}</p>
                  </div>
                  <Link
                    href={`/destinations/${alt.id}`}
                    className="inline-block text-xs font-bold text-[#164A41] hover:underline"
                  >
                    View Destination →
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
