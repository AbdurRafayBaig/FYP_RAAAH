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
    { name: 'Safety & Alerts', href: ROUTES.SAFETY },
    { name: 'Accommodations', href: ROUTES.ACCOMMODATIONS },
    { name: 'Culture & Heritage', href: ROUTES.CULTURE },
    { name: 'About Team', href: ROUTES.ABOUT_US },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 bg-emerald-50 p-1 group-hover:border-emerald-600 transition-colors">
              <Image 
                src="/logo.png" 
                alt="RAAAH Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                RAAAH
              </span>
              <span className="text-[10px] tracking-wider uppercase text-emerald-800 font-semibold -mt-1">
                Smart Tourism Northern PK
              </span>
            </div>
          </Link>

          {/* Clean Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="tel:1122"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              title="24/7 Rescue & Disaster Helpline"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Help 1122</span>
            </a>

            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-all shadow-xs"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href="tel:1122"
              className="p-2 rounded-lg text-red-700 bg-red-50 border border-red-200"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none"
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
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-800"
            >
              Portal Login
            </Link>
            <Link
              href={ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
