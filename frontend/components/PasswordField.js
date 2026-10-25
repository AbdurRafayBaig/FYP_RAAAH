"use client";

import { useState } from 'react';
import { useT } from '@/context/LanguageContext';
import Icon from '@/components/ui/Icon';

// Strength from length and the kinds of characters used; RAAAH's rule (8+ with a letter and a number) is "fair"
export function passwordStrength(password) {
  if (!password) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return 1;
  if (password.length >= 12 && kinds >= 3) return 3;
  return 2;
}

const LEVELS = [null, ['Weak', 'bg-critical'], ['Fair', 'bg-moderate'], ['Strong', 'bg-low']];

// A password input with a show / hide button and, optionally, a strength bar
export default function PasswordField({ id, label, value, onChange, autoComplete, showStrength = false, className, ...rest }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(value) : 0;

  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`${className} pe-11`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('Hide password') : t('Show password')}
          aria-pressed={visible}
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted hover:text-ink"
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
      {strength > 0 && (
        <div className="mt-2 flex items-center gap-2" aria-live="polite">
          <span className="flex flex-1 gap-1" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? LEVELS[strength][1] : 'bg-rule'}`} />
            ))}
          </span>
          <span className="text-[12px] text-ink-2">{t(LEVELS[strength][0])}</span>
        </div>
      )}
    </div>
  );
}
