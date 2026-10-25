"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/constants/roles';
import PageTitle from '@/components/ui/PageTitle';
import Notice from '@/components/ui/Notice';
import InterestPicker from '@/components/InterestPicker';
import { useT } from '@/context/LanguageContext';
import SavedDestinations from './SavedDestinations';

const toForm = (p) => ({
  fullName: p.fullName,
  email: p.email,
  interests: p.interests,
  locationConsent: p.locationConsent,
});

function Section({ title, description, children }) {
  return (
    <section className="grid gap-6 border-b border-rule py-8 md:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-[20px]">{title}</h2>
        {description && <p className="meta mt-1">{description}</p>}
      </div>
      <div className="max-w-lg">{children}</div>
    </section>
  );
}

// UC-03 Manage Profile and Preferences (Expanded Use Case Table 40, SSD Fig. 22)
export default function ProfileForm() {
  const { setUser } = useAuth();
  const t = useT();
  const [profile, setProfile] = useState(null);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState(null); // { tone, message }
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Steps 1-2: profile information, preferences and location consent
  useEffect(() => {
    Promise.all([api.getProfile(), api.getInterests()])
      .then(([{ profile }, { interests }]) => {
        setProfile(profile);
        setForm(toForm(profile));
        setOptions(interests);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  if (loadError) return <div className="page py-16"><Notice tone="error">{loadError}</Notice></div>;
  if (!form) return <p className="page py-24 meta">{t('Loading your profile…')}</p>;

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
    setStatus(null);
  };

  const toggleInterest = (name) =>
    update('interests', form.interests.includes(name) ? form.interests.filter((i) => i !== name) : [...form.interests, name]);

  // Steps 3-5
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const { profile: saved, message } = await api.updateProfile(form);
      setProfile(saved);
      setForm(toForm(saved));
      setFieldErrors({});
      setUser(saved);
      setStatus({ tone: 'success', message });
    } catch (err) {
      // Alt 4a: error shown, previous values kept on the server
      setFieldErrors(err.fields);
      setStatus({ tone: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(toForm(profile));
    setFieldErrors({});
    setStatus(null);
  };

  const error = (key) => fieldErrors[key] && <p className="mt-1.5 text-[13px] text-critical">{fieldErrors[key]}</p>;

  return (
    <div className="page pb-20">
      <PageTitle
        title={profile.fullName}
        aside={
          <dl className="text-[14px] md:text-right">
            <dt className="meta">{t('Your Tourist ID')}</dt>
            <dd className="data text-[16px] text-ink" dir="ltr">{profile.touristCode}</dd>
            <dd className="meta mt-1">{t(ROLE_LABELS[profile.role])}</dd>
          </dl>
        }
      >
        {t('Your details, what you like to travel for, and whether RAAAH may use your location.')}
      </PageTitle>

      {status && <Notice tone={status.tone} className="mt-6">{status.message}</Notice>}

      <form onSubmit={handleSubmit} noValidate>
        <Section title={t('Your details')}>
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="label">{t('Full name')}</label>
              <input id="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={`field ${fieldErrors.fullName ? 'field-error' : ''}`} />
              {error('fullName')}
            </div>
            <div>
              <label htmlFor="email" className="label">{t('Email')}</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={`field ${fieldErrors.email ? 'field-error' : ''}`} />
              {error('email')}
            </div>
          </div>
        </Section>

        {/* FR-01.04 */}
        <Section title={t('Travel preferences')} description={t('Used to rank alternative destinations for you.')}>
          <InterestPicker options={options} selected={form.interests} onToggle={toggleInterest} />
          {error('interests')}
        </Section>

        {/* FR-01.07 */}
        <Section title={t('Location')} description={t('Needed for check-in and for distances.')}>
          <label className="flex cursor-pointer items-start gap-3 py-1">
            <input
              type="checkbox"
              checked={form.locationConsent}
              onChange={(e) => update('locationConsent', e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-ink"
            />
            <span className="text-[15px]">
              {t('RAAAH may use my current location when I check in or ask for alternatives.')}
              <span className="meta mt-1 block">
                {t('Your location is read at that moment only. It is never stored and never shown to anyone; crowd levels are published as totals.')}
              </span>
            </span>
          </label>
          {error('locationConsent')}
        </Section>

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" onClick={resetForm} className="btn btn-quiet h-11">{t('Discard changes')}</button>
          <button type="submit" disabled={saving} className="btn btn-primary h-11">{saving ? t('Saving…') : t('Save changes')}</button>
        </div>
      </form>

      <SavedDestinations />
    </div>
  );
}
