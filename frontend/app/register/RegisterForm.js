"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { homePathForRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import Notice from '@/components/ui/Notice';

// Shown until the list arrives from the server (FR-01.04)
const DEFAULT_INTERESTS = ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography'];

const EMPTY = { fullName: '', email: '', password: '', confirmPassword: '', interests: [] };

// Step 6: confirmation with the new Tourist ID (FR-01.02)
function Confirmation({ user }) {
  return (
    <AuthLayout photo={PHOTOS.passu} title={`Welcome, ${user.fullName.split(' ')[0]}`} intro="Your account has been created.">

      <dl className="border-y border-rule py-5">
        <dt className="meta">Your Tourist ID</dt>
        <dd className="data mt-1 text-[22px] text-ink">{user.touristCode}</dd>
      </dl>
      <p className="mt-6 text-[15px] text-ink-2">
        To check in at a destination and see distances from where you are, allow RAAAH to use your location on your
        profile page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={ROUTES.DESTINATIONS} className="btn btn-primary flex-1">Explore destinations</Link>
        <Link href={ROUTES.PROFILE} className="btn btn-secondary flex-1">Go to my profile</Link>
      </div>
    </AuthLayout>
  );
}

// UC-01 Register Account (Expanded Use Case Table 38, SSD Fig. 20)
export default function RegisterForm() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [options, setOptions] = useState(DEFAULT_INTERESTS);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null); // { message, alreadyRegistered }
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    api.getInterests().then(({ interests }) => interests.length && setOptions(interests)).catch(() => {});
  }, []);

  // Pre-condition: the tourist does not already have an account
  useEffect(() => {
    if (!loading && user && !created) router.replace(homePathForRole(user.role));
  }, [loading, user, created, router]);

  if (created) return <Confirmation {...created} />;

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleInterest = (name) =>
    update('interests', form.interests.includes(name) ? form.interests.filter((i) => i !== name) : [...form.interests, name]);

  // Steps 3-5
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      setCreated(await register(form));
    } catch (err) {
      // Alt 4a (already registered) and 4b (fields to correct)
      setFieldErrors(err.fields);
      setError({ message: err.message, alreadyRegistered: err.status === 409 });
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key) => `field ${fieldErrors[key] ? 'field-error' : ''}`;
  const fieldError = (key) =>
    fieldErrors[key] && <p id={`${key}-error`} className="mt-1.5 text-[13px] text-critical">{fieldErrors[key]}</p>;
  const described = (key) => (fieldErrors[key] ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {});

  return (
    <AuthLayout
      photo={PHOTOS.passu}
      title="Create an account"
      intro="You get a Tourist ID, and RAAAH uses your interests to suggest places."
      footer={<>Already registered? <Link href={ROUTES.LOGIN} className="link">Sign in</Link></>}
    >
      {error && (
        <Notice tone="error" className="mb-6">
          {error.message}{' '}
          {error.alreadyRegistered && <Link href={ROUTES.LOGIN} className="link">Sign in</Link>}
        </Notice>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="fullName" className="label">Full name</label>
          <input id="fullName" autoComplete="name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={fieldClass('fullName')} {...described('fullName')} />
          {fieldError('fullName')}
        </div>
        <div>
          <label htmlFor="regEmail" className="label">Email</label>
          <input id="regEmail" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={fieldClass('email')} {...described('email')} />
          {fieldError('email')}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="regPassword" className="label">Password</label>
            <input id="regPassword" type="password" autoComplete="new-password" value={form.password} onChange={(e) => update('password', e.target.value)} className={fieldClass('password')} {...described('password')} />
          </div>
          <div>
            <label htmlFor="regConfirm" className="label">Confirm password</label>
            <input id="regConfirm" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className={fieldClass('confirmPassword')} {...described('confirmPassword')} />
          </div>
        </div>
        {fieldError('password') || fieldError('confirmPassword') || (
          <p className="meta -mt-2">At least 8 characters, with a letter and a number.</p>
        )}

        <fieldset {...described('interests')}>
          <legend className="label">What do you travel for?</legend>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
            {options.map((name) => (
              <label key={name} className="flex items-center gap-2.5 text-[15px] text-ink-2">
                <input type="checkbox" checked={form.interests.includes(name)} onChange={() => toggleInterest(name)} className="h-4 w-4 accent-ink" />
                {name}
              </label>
            ))}
          </div>
          {fieldError('interests')}
        </fieldset>

        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
