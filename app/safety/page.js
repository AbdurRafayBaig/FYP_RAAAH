import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlertCard from '@/components/AlertCard';
import { SAFETY_ALERTS, EMERGENCY_CONTACTS } from '@/data/safetyAlerts';
import Link from 'next/link';

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E3DC] pb-8">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-red-700">
              Disaster Risk & Emergency Management
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#041627]">
              Travel Safety & Regional Alerts
            </h1>
            <p className="text-sm text-[#575A60] max-w-2xl">
              Live updates on Karakoram Highway landslides, Babusar Pass weather freezes, and emergency contacts for Gilgit-Baltistan and KP.
            </p>
          </div>

          <Link
            href="/report-hazard"
            className="px-5 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0"
          >
            <span className="material-symbols-outlined text-base">report_problem</span>
            <span>Report Road Hazard / Landslide</span>
          </Link>
        </div>

        {/* Emergency Helpline Contacts Cards Grid */}
        <section className="space-y-4">
          <h2 className="font-serif-editorial text-2xl font-bold text-[#041627]">
            24/7 Disaster & Emergency Helplines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#E5E3DC] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{contact.region}</span>
                  <h3 className="text-sm font-bold text-[#041627] mt-0.5">{contact.name}</h3>
                  <span className="text-xs text-slate-600 block">{contact.service}</span>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-mono font-bold shrink-0 flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Active Hazard Alerts List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-2xl font-bold text-[#041627]">
              Active Disaster & Road Advisories ({SAFETY_ALERTS.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">Updated 10m ago by GBDMA</span>
          </div>

          <div className="space-y-6">
            {SAFETY_ALERTS.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        {/* Mountain Travel Safety Guidelines */}
        <section className="bg-white p-8 rounded-3xl border border-[#E5E3DC] space-y-6 shadow-sm">
          <h2 className="font-serif-editorial text-2xl font-bold text-[#041627]">
            Northern Mountain Travel Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC]">
              <span className="material-symbols-outlined text-amber-600 text-2xl">directions_car</span>
              <h3 className="font-bold text-[#041627]">1. Vehicle Check & Tyre Chains</h3>
              <p>Ensure 4WD capability for jeep tracks (Shimshal, Deosai). Carry tyre chains when crossing Babusar Pass or Khunjerab Pass above 3,500 meters.</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC]">
              <span className="material-symbols-outlined text-blue-600 text-2xl">thermostat</span>
              <h3 className="font-bold text-[#041627]">2. High Altitude Acclimatization</h3>
              <p>Stay hydrated and allow 24 hours of rest when moving above 2,500m (Hunza, Skardu) before strenuous treks to prevent AMS (Acute Mountain Sickness).</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC]">
              <span className="material-symbols-outlined text-emerald-600 text-2xl">nature_people</span>
              <h3 className="font-bold text-[#041627]">3. Leave No Trace & Eco Tourism</h3>
              <p>Avoid dumping plastic near lakes (Saif-ul-Malook, Attabad). Support local Balti & Brushaski artisan communities.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
