"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { isTouristRole } from '@/constants/roles';

export default function HomeCta() {
  const { user, loading } = useAuth();
  const t = useT();
  if (loading) return <section className="py-16" />;

  const tourist = user && isTouristRole(user.role);
  const heading = !user
    ? t('Check conditions before your next trip.')
    : tourist
      ? t('Where are you headed, {name}?', { name: user.fullName.split(' ')[0] })
      : t('See the current picture across all destinations.');

  return (
    <section className="page flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between">
      <p className="font-display text-[28px]">{heading}</p>
      <div className="flex gap-3">
        {!user ? (
          <>
            <Link href={ROUTES.REGISTER} className="btn btn-accent">{t('Create account')}</Link>
            <Link href={ROUTES.LOGIN} className="btn btn-secondary">{t('Sign in')}</Link>
          </>
        ) : tourist ? (
          <Link href={ROUTES.DESTINATIONS} className="btn btn-accent">{t('Browse destinations')}</Link>
        ) : (
          <Link href={ROUTES.ANALYTICS_DASHBOARD} className="btn btn-accent">{t('Open dashboard')}</Link>
        )}
      </div>
    </section>
  );
}
