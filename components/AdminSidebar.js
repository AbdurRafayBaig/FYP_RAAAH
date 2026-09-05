"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function AdminSidebar({ title = "Admin Portal" }) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  const links = [
    { name: 'Overview', href: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard' },
    { name: 'Destinations', href: ROUTES.DESTINATIONS, icon: 'location_on' },
    { name: 'Crowd Monitoring', href: ROUTES.CROWD_MAP, icon: 'groups' },
    { name: 'Safety Reports', href: ROUTES.SAFETY, icon: 'shield' },
    { name: 'Analytics', href: ROUTES.ANALYTICS_DASHBOARD, icon: 'bar_chart' },
    { name: 'Tourists', href: '#', icon: 'person' },
  ];

  return (
    <aside className="w-60 bg-[#17211F] text-white flex-shrink-0 min-h-screen p-4 flex flex-col justify-between border-r border-stone-700">
      <div className="space-y-6">
        {/* Admin Brand */}
        <div className="flex items-center space-x-3 pb-4 border-b border-stone-700">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5">
            <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide">RAAAH</h2>
            <span className="text-[10px] text-[#D9B77A] font-semibold uppercase tracking-wider block">
              {title}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#164A41] text-white'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Back to Tourist Site */}
      <div className="pt-4 border-t border-stone-700 space-y-3">
        <Link
          href={ROUTES.HOME}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Tourist Site</span>
        </Link>

        <div className="flex items-center space-x-2 bg-stone-800 p-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#164A41] border border-[#2F6B5B] flex items-center justify-center text-[#D9B77A] font-bold text-[10px]">
            AD
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[11px] font-semibold text-white truncate">Admin User</h4>
            <span className="text-[10px] text-stone-400 block truncate">admin@raaah.pk</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
