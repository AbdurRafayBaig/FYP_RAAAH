"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { DASHBOARD_ROLES, ROLE_LABELS, isTouristRole } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

export default function Navbar({ overlay = false }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const isTourist = user && isTouristRole(user.role);
  const hasDashboard = user && DASHBOARD_ROLES.includes(user.role);

  // FR-01.03 - features according to the user's role
  const links = [
    { name: 'Destinations', href: ROUTES.DESTINATIONS },
    ...(isTourist ? [{ name: 'Alternatives', href: ROUTES.RECOMMENDATIONS }] : []),
    ...(hasDashboard ? [{ name: 'Dashboard', href: ROUTES.ANALYTICS_DASHBOARD }] : []),
    { name: 'Safety', href: ROUTES.SAFETY },
    { name: 'Culture', href: ROUTES.CULTURE },
    { name: 'About', href: ROUTES.ABOUT_US },
  ];

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    // Same target as the session guard on protected pages, so the two never race
    router.replace(ROUTES.LOGIN);
  };

  const active = (href) => pathname.startsWith(href);
  const tone = overlay ? 'text-white' : 'text-ink';
  const quiet = overlay ? 'text-white/75 hover:text-white' : 'text-ink-2 hover:text-ink';

  return (
    <header className={overlay ? 'absolute inset-x-0 top-0 z-40' : 'border-b border-rule bg-paper'}>
      <div className="page flex h-16 items-center justify-between gap-6">
        <Link href={ROUTES.HOME} className={`flex items-center gap-2.5 ${tone}`}>
          <span className="relative h-8 w-8 overflow-hidden rounded-[3px] bg-white">
            <Image src="/logo.png" alt="" fill sizes="32px" className="object-contain p-0.5" priority />
          </span>
          <span className="font-display text-[22px] font-semibold tracking-tight">RAAAH</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[14px] underline-offset-[6px] ${
                active(link.href) ? `${tone} underline decoration-2` : quiet
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:1122" className={`data ${quiet}`} title="Rescue 1122 emergency helpline">
            Rescue 1122
          </a>
          {loading ? null : user ? (
            <>
              <Link
                href={isTourist ? ROUTES.PROFILE : ROUTES.ANALYTICS_DASHBOARD}
                className={`text-[14px] ${active(ROUTES.PROFILE) ? tone : quiet}`}
              >
                {/* Staff accounts are named after their office, so their role is clearer than a first word */}
                {isTourist ? user.fullName.split(' ')[0] : ROLE_LABELS[user.role]}
              </Link>
              <button onClick={handleLogout} className={`text-[14px] ${quiet}`}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className={`text-[14px] ${quiet}`}>
                Sign in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className={`btn h-9 ${overlay ? 'bg-white text-ink hover:bg-paper' : 'btn-primary'}`}
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 text-[14px] lg:hidden ${tone}`}
          aria-expanded={open}
          aria-label="Menu"
        >
          <Icon name={open ? 'close' : 'menu'} size={20} />
        </button>
      </div>

      {open && (
        <div className="border-t border-rule bg-paper lg:hidden">
          <nav className="page flex flex-col py-3" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-rule py-3 text-[15px] ${active(link.href) ? 'text-ink font-medium' : 'text-ink-2'}`}
              >
                {link.name}
              </Link>
            ))}
            <a href="tel:1122" className="border-b border-rule py-3 data text-ink-2">Rescue 1122</a>
            <div className="flex gap-3 pt-4">
              {user ? (
                <>
                  {isTourist && (
                    <Link href={ROUTES.PROFILE} onClick={() => setOpen(false)} className="btn btn-secondary flex-1">
                      Profile
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-primary flex-1">Sign out</button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)} className="btn btn-secondary flex-1">Sign in</Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setOpen(false)} className="btn btn-primary flex-1">Create account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
