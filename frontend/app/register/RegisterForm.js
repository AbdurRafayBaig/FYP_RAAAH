"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { homePathForRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import Notice from '@/components/ui/Notice';

const EMPTY = { fullName: '', email: '', password: '', confirmPassword: '' };

// UC-01 Register Account (Expanded Use Case Table 38, SSD Fig. 20)
export default function RegisterForm() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null); // { message, alreadyRegistered }
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  // Pre-condition: the tourist does not already have an account
  useEffect(() => {
    if (!loading && user && !created) router.replace(homePathForRole(user.role));
  }, [loading, user, created, router]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Steps 3-5; step 6 (the Tourist ID) is shown together with the choice of travel preferences
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      setCreated(true);
      await register(form);
      router.replace(`${ROUTES.PREFERENCES}?welcome=1`);
    } catch (err) {
      setCreated(false);
      // Alt 4a (already registered) and 4b (fields to correct)
      setFieldErrors(err.fields);
      setError({ message: err.message, alreadyRegistered: err.status === 409 });
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
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
      intro="You get a Tourist ID. Once you are signed in, you choose what you travel for."
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

        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
