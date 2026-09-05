import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shadow-xs">
                <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                RAAAH
              </span>
            </div>
            <p className="text-emerald-200 text-xs leading-relaxed max-w-sm">
              Intelligent Crowd Management & Smart Tourism Platform for Northern Pakistan (Hunza, Skardu, Naran, Swat, Murree).
            </p>
            <div className="pt-2 text-xs text-emerald-300 space-y-1 font-mono">
              <p className="font-bold text-amber-400">FAST-NUCES Final Year Project 2026</p>
              <p>Team: Abdur Rafay Baig (23F-3046) • Ammar Ahmad • Faiza Ali</p>
              <p>Supervisor: Dr. Muhammad Usama</p>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-amber-400 font-bold mb-4 uppercase tracking-wider text-xs">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200 font-medium">
              <li>
                <Link href={ROUTES.HOME} className="hover:text-white transition-colors">Home Portal</Link>
              </li>
              <li>
                <Link href={ROUTES.DESTINATIONS} className="hover:text-white transition-colors">Destinations</Link>
              </li>
              <li>
                <Link href={ROUTES.CROWD_MAP} className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>Live Crowd Map</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SAFETY} className="hover:text-white transition-colors">Travel Safety & Alerts</Link>
              </li>
              <li>
                <Link href={ROUTES.ACCOMMODATIONS} className="hover:text-white transition-colors">Accommodations</Link>
              </li>
              <li>
                <Link href={ROUTES.CULTURE} className="hover:text-white transition-colors">Culture & Heritage</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-amber-400 font-bold mb-4 uppercase tracking-wider text-xs">
              Emergency Helplines
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200">
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-red-400 text-base">medical_services</span>
                <span>Rescue 1122: <strong className="text-white font-mono">1122</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-blue-400 text-base">local_police</span>
                <span>KP Tourist Police: <strong className="text-white font-mono">1422</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-amber-400 text-base">warning</span>
                <span>GB Disaster Auth: <strong className="text-white font-mono">05811-920888</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-emerald-400 text-base">headset_mic</span>
                <span>RAAAH Helpline: <strong className="text-white font-mono">0800-72224</strong></span>
              </li>
            </ul>
          </div>

          {/* Portals & Team */}
          <div>
            <h4 className="text-amber-400 font-bold mb-4 uppercase tracking-wider text-xs">
              Portals & Project
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200 font-medium">
              <li>
                <Link href={ROUTES.ADMIN_DASHBOARD} className="hover:text-white transition-colors">Business Hotel Portal</Link>
              </li>
              <li>
                <Link href={ROUTES.ANALYTICS_DASHBOARD} className="hover:text-white transition-colors">Tourism Authority Dashboard</Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT_US} className="hover:text-white transition-colors">About Us & FYP Team</Link>
              </li>
              <li>
                <Link href={ROUTES.REPORT_HAZARD} className="hover:text-white transition-colors text-amber-300 flex items-center space-x-1">
                  <span className="material-symbols-outlined text-sm">report_problem</span>
                  <span>Report Road Hazard</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-400">
          <p>© 2026 RAAAH Platform. FAST-NUCES Computer Science FYP Defense.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-mono text-[11px]">
            <span>Anti-Plagiarism Verified</span>
            <span>FAST-NUCES Chiniot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
