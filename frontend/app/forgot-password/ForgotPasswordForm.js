"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { useT } from '@/context/LanguageContext';
import Notice from '@/components/ui/Notice';

// SRS 3.3.3 - the reset link is emailed; the answer is the same whether or not the email has an account
export default function ForgotPasswordForm({ teamEmail }) {
  const t = useT();
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ sending: false, sent: '', error: '', fieldError: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ sending: true, sent: '', error: '', fieldError: '' });
    try {
      const { message } = await api.forgotPassword(email);
      setState({ sending: false, sent: message, error: '', fieldError: '' });
    } catch (err) {
      setState({ sending: false, sent: '', error: err.message, fieldError: err.fields?.email || '' });
    }
  };

  if (state.sent) {
    return (
      <>
        <Notice tone="success">{t(state.sent)}</Notice>
        <p className="meta mt-6">
          {t('No email after a few minutes? Check the spam folder, or write to')}{' '}
          <a href={`mailto:${teamEmail}`} className="link" dir="ltr">{teamEmail}</a>.
        </p>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div>
        <label htmlFor="resetEmail" className="label">{t('Email')}</label>
        <input
          id="resetEmail"
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`field ${state.fieldError ? 'field-error' : ''}`}
          aria-invalid={Boolean(state.fieldError)}
        />
      </div>
      <button type="submit" disabled={state.sending} className="btn btn-accent h-11 w-full">
        {state.sending ? t('Sending…') : t('Send reset link')}
      </button>
    </form>
  );
}
