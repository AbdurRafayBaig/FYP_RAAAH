"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { DASHBOARD_ROLES, ROLE_LABELS, isTouristRole } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/Icon';

export function Logo({ light = false }) {
  return (
    <span className={`flex items-center gap-2 ${light ? 'text-white' : 'text-ink'}`}>
      <span className={`relative h-9 w-9 shrink-0 ${light ? 'rounded-full bg-white/90 p-1' : ''}`}>
        <Image src="/logo-mark.png" alt="" fill sizes="36px" className="object-contain" priority />
      </span>
      <span className="font-display text-[22px] font-semibold tracking-tight" dir="ltr">RAAAH</span>
    </span>
  );
}

// English / Urdu switch (the interface language; destination descriptions stay in English)
export function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
      lang={lang === 'ur' ? 'en' : 'ur'}
      aria-label={lang === 'ur' ? 'Switch to English' : 'اردو میں دیکھیں'}
      className={`flex items-center gap-1.5 text-[14px] ${className}`}
    >
      <Icon name="globe" size={16} />
      {lang === 'ur' ? 'English' : 'اردو'}
    </button>
  );
}

function RescueButton({ className = '' }) {
  const { t } = useLanguage();
  return (
    <a
      href="tel:1122"
      title={t('Rescue 1122 emergency helpline')}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full bg-critical px-3.5 text-[13px] font-medium text-white hover:bg-[#82261e] ${className}`}
    >
      <Icon name="phone" size={14} /> <span dir="ltr">1122</span> <span className="sr-only">{t('Rescue')}</span>
    </a>
  );
}

export default function Navbar({ overlay = false }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();

  const isTourist = user && isTouristRole(user.role);
  const hasDashboard = user && DASHBOARD_ROLES.includes(user.role);

  // FR-01.03 - features according to the user's role
  const links = [
    { name: t('Destinations'), href: ROUTES.DESTINATIONS },
    ...(isTourist ? [{ name: t('Alternatives'), href: ROUTES.RECOMMENDATIONS }] : []),
    ...(hasDashboard ? [{ name: t('Dashboard'), href: ROUTES.ANALYTICS_DASHBOARD }] : []),
    { name: t('Safety'), href: ROUTES.SAFETY },
    { name: t('Culture'), href: ROUTES.CULTURE },
    { name: t('About'), href: ROUTES.ABOUT_US },
  ];

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    // Same target as the session guard on protected pages, so the two never race
    router.replace(ROUTES.LOGIN);
  };

  const active = (href) => pathname.startsWith(href);
  const tone = overlay ? 'text-white' : 'text-ink';
  const quiet = overlay ? 'text-white/80 hover:text-white' : 'text-ink-2 hover:text-ink';

  return (
    <header className={overlay ? 'absolute inset-x-0 top-0 z-40' : 'border-b border-rule bg-paper'}>
      <div className="page flex h-16 items-center justify-between gap-6">
        <Link href={ROUTES.HOME} aria-label="RAAAH home"><Logo light={overlay} /></Link>

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
          <LanguageToggle className={quiet} />
          <RescueButton />
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
                {t('Sign out')}
              </button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className={`text-[14px] ${quiet}`}>
                {t('Sign in')}
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className={`btn h-9 ${overlay ? 'bg-white text-ink hover:bg-paper' : 'btn-primary'}`}
              >
                {t('Create account')}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <RescueButton />
          <button
            onClick={() => setOpen(!open)}
            className={`flex h-10 w-10 items-center justify-center ${tone}`}
            aria-expanded={open}
            aria-label={t('Menu')}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
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
            <LanguageToggle className="border-b border-rule py-3 text-ink-2" />
            <div className="flex gap-3 pt-4">
              {user ? (
                <>
                  {isTourist && (
                    <Link href={ROUTES.PROFILE} onClick={() => setOpen(false)} className="btn btn-secondary flex-1">
                      {t('Profile')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-primary flex-1">{t('Sign out')}</button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)} className="btn btn-secondary flex-1">{t('Sign in')}</Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setOpen(false)} className="btn btn-primary flex-1">{t('Create account')}</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
