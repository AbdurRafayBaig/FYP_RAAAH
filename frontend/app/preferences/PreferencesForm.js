"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/LanguageContext';
import { ROUTES } from '@/constants/routes';
import { safeNextPath } from '@/lib/safePath';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import InterestPicker from '@/components/InterestPicker';
import Notice from '@/components/ui/Notice';

// Shown until the list arrives from the server
const DEFAULT_INTERESTS = ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography'];

const safeNext = safeNextPath;

// FR-01.04 travel preferences, chosen after the first sign-in (UC-01 step 6 confirmation when welcome is set)
export default function PreferencesForm({ welcome, next }) {
  const router = useRouter();
  const t = useT();
  const { user, setUser, logout } = useAuth();
  const [options, setOptions] = useState(DEFAULT_INTERESTS);
  const [selected, setSelected] = useState(user.interests || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getInterests().then(({ interests }) => interests.length && setOptions(interests)).catch(() => {});
  }, []);

  const target = safeNext(next) || ROUTES.DESTINATIONS;

  const toggle = (name) =>
    setSelected((s) => (s.includes(name) ? s.filter((i) => i !== name) : [...s, name]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { profile } = await api.updateProfile({
        fullName: user.fullName,
        email: user.email,
        interests: selected,
        locationConsent: user.locationConsent,
      });
      setUser(profile);
      router.replace(target);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // This page has no navigation bar, so signing out is offered here (FR-01.03)
  const signOut = async () => {
    await logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <AuthLayout
      photo={PHOTOS.passu}
      title={welcome ? t('Welcome, {name}', { name: user.fullName.split(' ')[0] }) : t('What do you travel for?')}
      intro={
        welcome
          ? t('Your account has been created. One more step: tell us what you travel for.')
          : t('RAAAH uses this to rank quieter alternatives for you.')
      }
      footer={
        <>
          {t('You are signed in as {email}.', { email: user.email })}{' '}
          <button type="button" onClick={signOut} className="link">{t('Sign out')}</button>
        </>
      }
    >
      {welcome && user.touristCode && (
        <dl className="mb-8 border-y border-rule py-5">
          <dt className="meta">{t('Your Tourist ID')}</dt>
          <dd className="data mt-1 text-[22px] text-ink" dir="ltr">{user.touristCode}</dd>
        </dl>
      )}

      {error && <Notice tone="error" className="mb-6">{error}</Notice>}

      <form onSubmit={handleSubmit}>
        <InterestPicker
          options={options}
          selected={selected}
          onToggle={toggle}
          legend={welcome ? t('What do you travel for?') : t('Choose any that apply')}
        />
        <p className="meta mt-3">{t('You can change this at any time on your profile.')}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving || selected.length === 0} className="btn btn-accent h-11 flex-1">
            {saving ? t('Saving…') : t('Save and continue')}
          </button>
          <button type="button" onClick={() => router.replace(target)} className="btn btn-quiet h-11 flex-1">
            {t('Skip for now')}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
