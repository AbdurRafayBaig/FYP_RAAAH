import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlertCard from '@/components/AlertCard';
import { SAFETY_ALERTS, EMERGENCY_CONTACTS } from '@/data/safetyAlerts';
import Link from 'next/link';

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#D65A4A] uppercase tracking-wider block">
              Travel Safety
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211F]">
              Safety Information
            </h1>
            <p className="text-xs sm:text-sm text-[#66736F] max-w-2xl leading-relaxed">
              Stay informed about active road conditions, weather hazards, and safety advisories across Northern Pakistan before you travel.
            </p>
          </div>

          <Link
            href="/report-hazard"
            className="px-5 py-2.5 rounded-lg bg-[#D65A4A] hover:bg-[#A83232] text-white font-semibold text-xs transition-colors flex items-center space-x-2 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">report_problem</span>
            <span>Report a Hazard</span>
          </Link>
        </div>

        {/* Emergency Helpline Contacts */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#17211F]">
            Emergency Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-[#66736F] uppercase tracking-wider">{contact.region}</span>
                  <h3 className="text-sm font-bold text-[#17211F] mt-0.5">{contact.name}</h3>
                  <span className="text-xs text-[#66736F] block">{contact.service}</span>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-mono font-bold shrink-0 flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Active Safety Advisories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#17211F]">
              Active Safety Advisories ({SAFETY_ALERTS.length})
            </h2>
            <span className="text-[11px] text-[#66736F]">Updated 10 minutes ago</span>
          </div>

          <div className="space-y-4">
            {SAFETY_ALERTS.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        {/* Travel Safety Tips */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-6">
          <h2 className="text-xl font-bold text-[#17211F]">
            Mountain Travel Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#66736F]">
            <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F5] border border-stone-200">
              <span className="material-symbols-outlined text-[#C68A19] text-xl">directions_car</span>
              <h3 className="font-bold text-[#17211F] text-sm">Vehicle Preparation</h3>
              <p className="leading-relaxed">Ensure 4WD capability for jeep tracks. Carry tyre chains when crossing passes above 3,500 metres.</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F5] border border-stone-200">
              <span className="material-symbols-outlined text-[#2F6B5B] text-xl">thermostat</span>
              <h3 className="font-bold text-[#17211F] text-sm">Altitude Awareness</h3>
              <p className="leading-relaxed">Stay hydrated and allow 24 hours of rest when moving above 2,500m before strenuous activity to prevent AMS.</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-[#F7F8F5] border border-stone-200">
              <span className="material-symbols-outlined text-[#164A41] text-xl">nature_people</span>
              <h3 className="font-bold text-[#17211F] text-sm">Leave No Trace</h3>
              <p className="leading-relaxed">Avoid littering near lakes and rivers. Support local communities by hiring village guides and staying at community-run lodges.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
