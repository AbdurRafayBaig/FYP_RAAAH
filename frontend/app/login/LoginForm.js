"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { homePathForRole, isTouristRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { safeNextPath } from '@/lib/safePath';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import Notice from '@/components/ui/Notice';
import PasswordField from '@/components/PasswordField';
import { useT } from '@/context/LanguageContext';

const safeNext = safeNextPath;

// Step 5: home page or dashboard according to the role; a tourist who has not chosen travel
// preferences yet is asked for them first (FR-01.04)
function pathAfterLogin(user, next) {
  const target = safeNext(next) || homePathForRole(user.role);
  if (isTouristRole(user.role) && user.interests?.length === 0) {
    return `${ROUTES.PREFERENCES}?next=${encodeURIComponent(target)}`;
  }
  return target;
}

// UC-02 Login (Expanded Use Case Table 39, SSD Fig. 21)
export default function LoginForm({ next }) {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in: go straight to the role's home page
  useEffect(() => {
    if (!loading && user) router.replace(pathAfterLogin(user, next));
  }, [loading, user, next, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError(t('Please enter your email and password.'));
      return;
    }
    setSubmitting(true);
    try {
      // Step 4: credentials verified and role identified by the server
      const loggedIn = await login(email, password);
      router.replace(pathAfterLogin(loggedIn, next));
    } catch (err) {
      // Alt 4a: invalid credentials
      setError(err.message);
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      photo={PHOTOS.fairyMeadows}
      title={t('Sign in')}
      intro={t('Check crowd, weather and hazards before you travel.')}
      footer={<>{t('No account yet?')} <Link href={ROUTES.REGISTER} className="link">{t('Create one')}</Link></>}
    >
      {error && <Notice tone="error" className="mb-6">{error}</Notice>}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">{t('Email')}</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" dir="ltr" />
        </div>
        <div>
          <PasswordField id="password" label={t('Password')} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" dir="ltr" />
          <Link href={ROUTES.FORGOT_PASSWORD} className="link mt-2 inline-block text-[13px]">{t('Forgot your password?')}</Link>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary h-11 w-full">
          {submitting ? t('Signing in…') : t('Sign in')}
        </button>
      </form>
    </AuthLayout>
  );
}