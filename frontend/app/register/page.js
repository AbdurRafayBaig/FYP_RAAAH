"use client";

import Link from 'next/link';
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { PHOTOS } from '@/data/photos';

const INTERESTS = ['Nature', 'Historical Sites', 'Adventure', 'Culture', 'Photography'];

// UC-01 Register Account - interface only; the registration service is planned for the next phase
export default function RegisterPage() {
  const [selected, setSelected] = useState([]);

  const toggle = (name) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));

  return (
    <AuthLayout
      photo={PHOTOS.passu}
      title="Create an account"
      intro="You get a Tourist ID, and RAAAH uses your interests to suggest places."
      footer={<>Already registered? <Link href="/login" className="link">Sign in</Link></>}
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="fullName" className="label">Full name</label>
          <input id="fullName" autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="regEmail" className="label">Email</label>
          <input id="regEmail" type="email" autoComplete="email" className="field" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="regPassword" className="label">Password</label>
            <input id="regPassword" type="password" autoComplete="new-password" className="field" />
          </div>
          <div>
            <label htmlFor="regConfirm" className="label">Confirm password</label>
            <input id="regConfirm" type="password" autoComplete="new-password" className="field" />
          </div>
        </div>

        <fieldset>
          <legend className="label">What do you travel for?</legend>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
            {INTERESTS.map((name) => (
              <label key={name} className="flex items-center gap-2.5 text-[15px] text-ink-2">
                <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} className="h-4 w-4 accent-ink" />
                {name}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary w-full">Create account</button>
      </form>
    </AuthLayout>
  );
}
