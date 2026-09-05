"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function AdminSidebar({ title = "Portal Dashboard" }) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  const links = [
    { name: 'Business Portal Home', href: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard' },
    { name: 'Tourism Authority Analytics', href: ROUTES.ANALYTICS_DASHBOARD, icon: 'bar_chart' },
    { name: 'Live Density Monitor', href: ROUTES.CROWD_MAP, icon: 'map' },
    { name: 'Hazard Incident Log', href: ROUTES.SAFETY, icon: 'warning' },
    { name: 'Hotel & Lodge Registry', href: ROUTES.ACCOMMODATIONS, icon: 'hotel' },
    { name: 'Tourist Main Portal', href: ROUTES.HOME, icon: 'home' },
  ];

  return (
    <aside className="w-64 bg-[#041627] text-white flex-shrink-0 min-h-screen p-5 flex flex-col justify-between border-r border-slate-800">
      <div className="space-y-8">
        {/* Brand Logo & Portal Tag */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white p-1">
            <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
          </div>
          <div>
            <h2 className="font-serif-editorial text-xl font-bold tracking-wide">RAAAH</h2>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
              {title}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Authority Profile Card */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-400 font-bold text-xs">
            GB
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Gilgit Tourism Auth</h4>
            <span className="text-[10px] text-slate-400 block truncate">Gov. Officer Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
