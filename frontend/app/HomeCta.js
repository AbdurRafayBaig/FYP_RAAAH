"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { isTouristRole } from '@/constants/roles';

export default function HomeCta() {
  const { user, loading } = useAuth();
  if (loading) return <section className="py-16" />;

  const tourist = user && isTouristRole(user.role);
  const heading = !user
    ? 'Check conditions before your next trip.'
    : tourist
      ? `Where are you headed, ${user.fullName.split(' ')[0]}?`
      : 'See the current picture across all destinations.';

  return (
    <section className="page flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between">
      <p className="font-display text-[28px]">{heading}</p>
      <div className="flex gap-3">
        {!user ? (
          <>
            <Link href={ROUTES.REGISTER} className="btn btn-primary">Create account</Link>
            <Link href={ROUTES.LOGIN} className="btn btn-secondary">Sign in</Link>
          </>
        ) : tourist ? (
          <Link href={ROUTES.DESTINATIONS} className="btn btn-primary">Browse destinations</Link>
        ) : (
          <Link href={ROUTES.ANALYTICS_DASHBOARD} className="btn btn-primary">Open dashboard</Link>
        )}
      </div>
    </section>
  );
}
