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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo state toggle

  const navLinks = [
    { name: 'Explore', href: ROUTES.HOME },
    { name: 'Destinations', href: ROUTES.DESTINATIONS },
    { name: 'Safety', href: ROUTES.SAFETY },
    { name: 'About Us', href: ROUTES.ABOUT_US },
  ];

  if (isLoggedIn) {
    navLinks.push({ name: 'My Trips', href: ROUTES.MY_TRIPS });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-stone-200 bg-[#F7F8F5] p-1 group-hover:border-[#164A41] transition-colors">
              <Image 
                src="/logo.png" 
                alt="RAAAH Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-[#164A41] group-hover:text-[#2F6B5B] transition-colors">
                RAAAH
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#66736F] font-semibold -mt-1">
                Northern Travel & Safety
              </span>
            </div>
          </Link>

          {/* Simple Tourist Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#164A41] text-white shadow-2xs'
                      : 'text-[#17211F] hover:text-[#164A41] hover:bg-[#F7F8F5]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="tel:1122"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              title="24/7 Rescue & Disaster Helpline"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Help 1122</span>
            </a>

            {!isLoggedIn ? (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#164A41] hover:bg-[#F7F8F5] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#164A41] hover:bg-[#2F6B5B] transition-all shadow-2xs"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={ROUTES.MY_TRIPS}
                  className="p-2 rounded-lg text-[#17211F] hover:bg-[#F7F8F5]"
                  title="Notifications & Safety Alerts"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                </Link>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#F7F8F5] border border-stone-200 text-xs font-semibold text-[#17211F]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#164A41] text-white flex items-center justify-center font-bold text-[10px]">
                    AR
                  </span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Portal Link (Demarcated cleanly for Admin) */}
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              className="ml-2 text-xs font-semibold text-[#66736F] hover:text-[#164A41] underline"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href="tel:1122"
              className="p-2 rounded-lg text-red-700 bg-red-50 border border-red-200"
              title="Help 1122"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#17211F] hover:bg-stone-100 focus:outline-none"
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
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-[#164A41] text-white font-bold'
                    : 'text-[#17211F] hover:bg-[#F7F8F5]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-bold text-[#164A41] bg-[#F7F8F5] border border-stone-200"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.REGISTER}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#164A41]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
