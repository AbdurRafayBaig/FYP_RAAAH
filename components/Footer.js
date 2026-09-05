import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-[#05100C] text-white border-t border-slate-800/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info & Academic Attribution */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shadow-md">
                <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
              </div>
              <span className="font-serif-editorial text-2xl font-bold text-white tracking-wide">
                RAAAH
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pr-4 font-light">
              Intelligent Crowd Management and Smart Tourism Platform for Northern Pakistan (Hunza, Skardu, Naran, Swat, Murree). Empowering travelers with real-time crowd metrics, AI route recommendations, and disaster hazard alerts.
            </p>
            <div className="pt-3 text-xs text-slate-400 border-t border-slate-800/80 space-y-1 font-mono">
              <p className="font-semibold text-[#D4A373]">Final Year Project 2026 — FAST-NUCES</p>
              <p>Lead Architect: Abdur Rafay Baig (23F-3046)</p>
              <p>Team: M Ammar Ahmad (23P-3071) • Faiza Ali (23F-0739)</p>
              <p>Supervisor: Dr. Muhammad Usama</p>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="font-serif-editorial text-base font-semibold text-[#D4A373] mb-4 uppercase tracking-widest text-xs">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
                <Link href={ROUTES.SAFETY} className="hover:text-white transition-colors">Travel Safety & Advisories</Link>
              </li>
              <li>
                <Link href={ROUTES.ACCOMMODATIONS} className="hover:text-white transition-colors">Hotel & Lodge Booking</Link>
              </li>
              <li>
                <Link href={ROUTES.CULTURE} className="hover:text-white transition-colors">Culture & Heritage</Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div>
            <h4 className="font-serif-editorial text-base font-semibold text-[#D4A373] mb-4 uppercase tracking-widest text-xs">
              Emergency Helplines
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
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
                <span>GB Disaster Authority: <strong className="text-white font-mono">05811-920888</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-emerald-400 text-base">headset_mic</span>
                <span>RAAAH Helpline: <strong className="text-white font-mono">0800-72224</strong></span>
              </li>
            </ul>
          </div>

          {/* Portals & About */}
          <div>
            <h4 className="font-serif-editorial text-base font-semibold text-[#D4A373] mb-4 uppercase tracking-widest text-xs">
              Portals & Project
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 RAAAH Platform. FAST-NUCES Computer Science FYP Defense.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-mono">
            <span>Anti-Plagiarism Verified</span>
            <span>FAST-NUCES Chiniot</span>
            <span>Smart Tourism Northern PK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
