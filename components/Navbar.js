"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';

export default function Navbar() {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'Destinations', href: ROUTES.DESTINATIONS },
    { name: 'Live Crowd Map', href: ROUTES.CROWD_MAP },
    { name: 'Safety Advisories', href: ROUTES.SAFETY },
    { name: 'Accommodations', href: ROUTES.ACCOMMODATIONS },
    { name: 'Culture & Heritage', href: ROUTES.CULTURE },
    { name: 'About FYP Team', href: ROUTES.ABOUT_US },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#05100C]/90 backdrop-blur-xl border-b border-white/10 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Emblem */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/20 bg-white p-1.5 shadow-md transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="RAAAH Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-editorial text-2xl font-bold tracking-wider text-white group-hover:text-[#D4A373] transition-colors">
                RAAAH
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#A3B18A] font-semibold -mt-1">
                Smart Tourism Northern PK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D4A373] text-black shadow-md font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Clean Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Emergency Hotline Pill */}
            <a
              href="tel:1122"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-300 bg-red-950/60 border border-red-500/30 hover:bg-red-900/60 transition-colors"
              title="24/7 Rescue & Disaster Helpline"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Rescue 1122</span>
            </a>

            {/* Portal Sign In Link */}
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#D4A373] hover:bg-[#E8B931] transition-all shadow-md hover:shadow-amber-500/20"
            >
              Portal Access →
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="tel:1122"
              className="p-2 rounded-full text-red-300 bg-red-950/80 border border-red-500/30"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#05100C] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-[#D4A373] text-black font-bold'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D4A373]"
            >
              Portal Access
            </Link>
            <Link
              href={ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
