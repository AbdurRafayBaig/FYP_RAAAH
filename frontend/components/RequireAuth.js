"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { homePathForRole } from '@/constants/roles';

// Client-side guard for pages that need a logged-in user (and optionally a role).
// The API enforces the same rules on the server for every request (SRS 3.3.3).
export default function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname || '/')}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return <p className="page py-24 meta">Checking your session…</p>;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="page py-24">
        <h1 className="text-[32px]">Access denied</h1>
        <p className="mt-2 text-ink-2">This part of RAAAH is not available for your account.</p>
        <Link href={homePathForRole(user.role)} className="link mt-4 inline-block">Go to your home page</Link>
      </div>
    );
  }

  return children;
}
