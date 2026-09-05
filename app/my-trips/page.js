import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const MOCK_TRIPS = [
  { id: 1, destination: 'Hunza Valley', region: 'Gilgit-Baltistan', date: '12 Aug 2026', image: '/destinations/hunza.jpg' },
  { id: 2, destination: 'Skardu', region: 'Gilgit-Baltistan', date: '05 Aug 2026', image: '/destinations/skardu.jpg' },
  { id: 3, destination: 'Naltar Valley', region: 'Gilgit-Baltistan', date: '28 Jul 2026', image: '/destinations/naltar.jpg' },
];

const MOCK_SAVED = [
  { id: 1, name: 'Fairy Meadows', region: 'Gilgit-Baltistan' },
  { id: 2, name: 'Deosai National Park', region: 'Gilgit-Baltistan' },
  { id: 3, name: 'Swat Valley', region: 'Khyber Pakhtunkhwa' },
];

export default function MyTripsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
        
        {/* Profile Header */}
        <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#164A41] text-white flex items-center justify-center font-bold text-xl">
              AR
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#17211F]">Abdur Rafay</h1>
              <p className="text-xs text-[#66736F]">abdurrafay@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-stone-100 text-center">
            <div>
              <span className="text-lg font-bold text-[#164A41] block">{MOCK_TRIPS.length}</span>
              <span className="text-[11px] text-[#66736F]">Places Visited</span>
            </div>
            <div>
              <span className="text-lg font-bold text-[#164A41] block">{MOCK_SAVED.length}</span>
              <span className="text-[11px] text-[#66736F]">Saved Destinations</span>
            </div>
            <div>
              <span className="text-lg font-bold text-[#164A41] block">3</span>
              <span className="text-[11px] text-[#66736F]">Travel Interests</span>
            </div>
          </div>

          {/* Travel Interests Tags */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
            <span className="px-2.5 py-1 rounded-lg bg-[#164A41] text-white text-[11px] font-medium">Nature ✓</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#164A41] text-white text-[11px] font-medium">Adventure ✓</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#164A41] text-white text-[11px] font-medium">Photography ✓</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F7F8F5] text-[#66736F] text-[11px] font-medium border border-stone-200">Culture</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F7F8F5] text-[#66736F] text-[11px] font-medium border border-stone-200">Historical Sites</span>
          </div>
        </section>

        {/* My Trips / Visit History */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#17211F]">My Trips</h2>
          <p className="text-xs text-[#66736F]">Your recent visits.</p>

          <div className="space-y-3">
            {MOCK_TRIPS.map((trip) => (
              <div key={trip.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF5F0] text-[#164A41] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17211F]">{trip.destination}</h3>
                    <span className="text-[11px] text-[#66736F]">{trip.region}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#66736F] block">Visited</span>
                  <span className="text-xs font-semibold text-[#17211F]">{trip.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Destinations */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#17211F]">Saved Destinations</h2>
          <p className="text-xs text-[#66736F]">Places you want to visit next.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MOCK_SAVED.map((saved) => (
              <div key={saved.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <h3 className="text-sm font-bold text-[#17211F]">{saved.name}</h3>
                <span className="text-[11px] text-[#66736F] block">{saved.region}</span>
                <Link href="/destinations" className="text-[11px] font-semibold text-[#164A41] hover:underline">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#17211F]">Notifications</h2>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-start space-x-3">
              <span className="material-symbols-outlined text-[#D65A4A] text-lg shrink-0 mt-0.5">warning</span>
              <div>
                <h4 className="text-xs font-bold text-[#17211F]">Safety update</h4>
                <p className="text-[11px] text-[#66736F]">A verified hazard has been reported near Karakoram Highway (Aliabad to Passu).</p>
                <span className="text-[10px] text-[#66736F] mt-1 block">2 hours ago</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-start space-x-3">
              <span className="material-symbols-outlined text-[#C68A19] text-lg shrink-0 mt-0.5">partly_cloudy_day</span>
              <div>
                <h4 className="text-xs font-bold text-[#17211F]">Weather update</h4>
                <p className="text-[11px] text-[#66736F]">Weather conditions in Skardu have changed. Check before travelling.</p>
                <span className="text-[10px] text-[#66736F] mt-1 block">Yesterday</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-start space-x-3">
              <span className="material-symbols-outlined text-[#2E7D5B] text-lg shrink-0 mt-0.5">check_circle</span>
              <div>
                <h4 className="text-xs font-bold text-[#17211F]">Destination update</h4>
                <p className="text-[11px] text-[#66736F]">Naltar Valley crowd levels have dropped. A good time to visit.</p>
                <span className="text-[10px] text-[#66736F] mt-1 block">2 days ago</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
