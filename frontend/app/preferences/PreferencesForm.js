"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import Notice from '@/components/ui/Notice';

// Shown until the list arrives from the server
const DEFAULT_INTERESTS = ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography'];

const HINTS = {
  Nature: 'Lakes, meadows and glaciers',
  'Historical Sites': 'Forts, palaces and old mosques',
  Adventure: 'Treks, jeep tracks and high passes',
  Culture: 'Festivals, food and village life',
  Photography: 'Viewpoints and big landscapes',
};

// Only same-site paths are accepted as the page to continue to
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '');

// FR-01.04 travel preferences, chosen after the first sign-in (UC-01 step 6 confirmation when welcome is set)
export default function PreferencesForm({ welcome, next }) {
  const router = useRouter();
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
      title={welcome ? `Welcome, ${user.fullName.split(' ')[0]}` : 'What do you travel for?'}
      intro={
        welcome
          ? 'Your account has been created. One more step: tell us what you travel for.'
          : 'RAAAH uses this to rank quieter alternatives for you.'
      }
      footer={
        <>
          You are signed in as {user.email}.{' '}
          <button type="button" onClick={signOut} className="link">Sign out</button>
        </>
      }
    >
      {welcome && user.touristCode && (
        <dl className="mb-8 border-y border-rule py-5">
          <dt className="meta">Your Tourist ID</dt>
          <dd className="data mt-1 text-[22px] text-ink">{user.touristCode}</dd>
        </dl>
      )}

      {error && <Notice tone="error" className="mb-6">{error}</Notice>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="label">{welcome ? 'What do you travel for?' : 'Choose any that apply'}</legend>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {options.map((name) => {
              const on = selected.includes(name);
              return (
                <label
                  key={name}
                  className={`relative flex cursor-pointer flex-col rounded-[3px] border px-4 py-3 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-accent ${
                    on ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface hover:border-ink/50'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2 text-[15px] font-medium">
                    {name}
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(name)}
                      aria-label={name}
                      aria-describedby={`hint-${name.replace(/\s+/g, '-')}`}
                      className={`h-4 w-4 shrink-0 ${on ? 'accent-paper' : 'accent-ink'}`}
                    />
                  </span>
                  <span id={`hint-${name.replace(/\s+/g, '-')}`} className={`text-[13px] ${on ? 'text-paper/75' : 'text-muted'}`}>{HINTS[name]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className="meta mt-3">You can change this at any time on your profile.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving || selected.length === 0} className="btn btn-primary flex-1">
            {saving ? 'Saving…' : 'Save and continue'}
          </button>
          <button type="button" onClick={() => router.replace(target)} className="btn btn-quiet flex-1">
            Skip for now
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
