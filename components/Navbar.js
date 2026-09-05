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
    { name: 'Live Crowd Map', href: ROUTES.CROWD_MAP, badge: 'LIVE' },
    { name: 'Safety & Hazards', href: ROUTES.SAFETY, badge: 'Alerts' },
    { name: 'Accommodations', href: ROUTES.ACCOMMODATIONS },
    { name: 'Heritage & Culture', href: ROUTES.CULTURE },
    { name: 'About Us', href: ROUTES.ABOUT_US },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F8]/95 backdrop-blur-md border-b border-[#E5E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#D5D3C8] bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="RAAAH Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-editorial text-2xl font-bold tracking-tight text-[#041627]">
                RAAAH
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#575A60] font-medium -mt-1">
                Smart Tourism Northern PK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#041627] text-white shadow-sm'
                      : 'text-[#1A1C1C] hover:bg-[#EAE8E0] hover:text-[#041627]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isActive ? 'bg-amber-400 text-black' : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Emergency Hotline Button */}
            <a
              href="tel:1122"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              title="24/7 Disaster & Emergency Rescue Helpline"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Help 1122</span>
            </a>

            {/* Business / Authority Portal Link */}
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#041627] bg-[#EAE8E0] border border-[#D5D3C8] hover:bg-[#DFDDD3] transition-colors"
            >
              Portal Login
            </Link>

            {/* Tourist Register / Profile */}
            <Link
              href={ROUTES.LOGIN}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#041627] hover:bg-[#003120] shadow-sm transition-colors"
            >
              Tourist Sign In
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="tel:1122"
              className="p-2 rounded-full text-red-700 bg-red-50 border border-red-200"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#1A1C1C] hover:bg-[#EAE8E0] focus:outline-none"
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
        <div className="lg:hidden border-b border-[#E5E3DC] bg-[#FAF9F8] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-[#041627] text-white font-semibold'
                    : 'text-[#1A1C1C] hover:bg-[#EAE8E0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#E5E3DC] grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-[#041627] bg-[#EAE8E0] border border-[#D5D3C8]"
            >
              Portal Login
            </Link>
            <Link
              href={ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#041627]"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
