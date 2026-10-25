"use client";

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useT } from '@/context/LanguageContext';
import { ROUTES } from '@/constants/routes';
import Notice from '@/components/ui/Notice';
import PasswordField from '@/components/PasswordField';

// Second step of the password reset: the link from the email carries the token
export default function ResetPasswordForm({ token }) {
  const t = useT();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState({ saving: false, done: '', error: '', fields: {} });

  if (!token) {
    return (
      <Notice tone="error">
        {t('This link is not complete. Open the link from the email again, or ask for a new one.')}{' '}
        <Link href={ROUTES.FORGOT_PASSWORD} className="link">{t('Ask for a new link')}</Link>
      </Notice>
    );
  }

  if (state.done) {
    return (
      <>
        <Notice tone="success">{t(state.done)}</Notice>
        <Link href={ROUTES.LOGIN} className="btn btn-accent mt-6 h-11 w-full">{t('Sign in')}</Link>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ saving: true, done: '', error: '', fields: {} });
    try {
      const { message } = await api.resetPassword(token, password, confirmPassword);
      setState({ saving: false, done: message, error: '', fields: {} });
    } catch (err) {
      setState({ saving: false, done: '', error: err.message, fields: err.fields || {} });
      setPassword('');
      setConfirmPassword('');
    }
  };

  const fieldClass = (key) => `field ${state.fields[key] ? 'field-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {state.error && (
        <Notice tone="error">
          {state.error}{' '}
          {!Object.keys(state.fields).length && <Link href={ROUTES.FORGOT_PASSWORD} className="link">{t('Ask for a new link')}</Link>}
        </Notice>
      )}
      <PasswordField id="newPassword" label={t('New password')} autoComplete="new-password" dir="ltr" showStrength value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass('password')} />
      <PasswordField id="newPasswordConfirm" label={t('Confirm password')} autoComplete="new-password" dir="ltr" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fieldClass('confirmPassword')} />
      <p className="meta -mt-2">{state.fields.password || state.fields.confirmPassword || t('At least 8 characters, with a letter and a number.')}</p>
      <button type="submit" disabled={state.saving} className="btn btn-accent h-11 w-full">
        {state.saving ? t('Saving…') : t('Save new password')}
      </button>
    </form>
  );
}
