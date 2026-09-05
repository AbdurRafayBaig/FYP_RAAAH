import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-[#164A41] text-white pt-14 pb-10 mt-auto border-t border-[#2F6B5B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-[#2F6B5B]/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1">
                <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                RAAAH
              </span>
            </div>
            <p className="text-stone-200 text-xs leading-relaxed max-w-sm">
              Helping travellers make informed decisions across Northern Pakistan (Hunza, Skardu, Naran, Swat, Murree) with real-time crowd, weather, and safety intelligence.
            </p>
            <div className="pt-2 text-xs text-stone-300 space-y-1">
              <p className="font-semibold text-[#D9B77A]">FAST-NUCES Final Year Project 2026</p>
              <p>Team: Abdur Rafay Baig • Ammar Ahmad • Faiza Ali</p>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-[#D9B77A] font-bold mb-4 uppercase tracking-wider text-xs">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-200 font-medium">
              <li>
                <Link href={ROUTES.HOME} className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href={ROUTES.DESTINATIONS} className="hover:text-white transition-colors">Destinations</Link>
              </li>
              <li>
                <Link href={ROUTES.SAFETY} className="hover:text-white transition-colors">Safety Information</Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT_US} className="hover:text-white transition-colors">About RAAAH</Link>
              </li>
              <li>
                <Link href={ROUTES.REPORT_HAZARD} className="hover:text-white transition-colors text-[#D9B77A]">Report a Hazard</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-[#D9B77A] font-bold mb-4 uppercase tracking-wider text-xs">
              Emergency Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-200">
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-red-300 text-base">medical_services</span>
                <span>Rescue 1122: <strong className="text-white font-mono">1122</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-emerald-300 text-base">local_police</span>
                <span>KP Tourist Police: <strong className="text-white font-mono">1422</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-300 text-base">warning</span>
                <span>GB Disaster Auth: <strong className="text-white font-mono">05811-920888</strong></span>
              </li>
            </ul>
          </div>

          {/* Authority & Admin */}
          <div>
            <h4 className="text-[#D9B77A] font-bold mb-4 uppercase tracking-wider text-xs">
              Portals
            </h4>
            <ul className="space-y-2 text-xs text-stone-200 font-medium">
              <li>
                <Link href={ROUTES.ADMIN_DASHBOARD} className="hover:text-white transition-colors">Admin Operations</Link>
              </li>
              <li>
                <Link href={ROUTES.ANALYTICS_DASHBOARD} className="hover:text-white transition-colors">Tourism Authority Portal</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-stone-300">
          <p>© 2026 RAAAH. FAST-NUCES Final Year Project.</p>
          <p className="mt-2 md:mt-0 text-[11px] text-stone-400">
            Designed for Northern Pakistan Travellers
          </p>
        </div>
      </div>
    </footer>
  );
}
