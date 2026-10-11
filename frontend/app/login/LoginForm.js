"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { homePathForRole } from '@/constants/roles';
import { PHOTOS } from '@/data/photos';
import AuthLayout from '@/components/AuthLayout';
import Notice from '@/components/ui/Notice';

// Only same-site paths are accepted as a post-login destination
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '');

// UC-02 Login (Expanded Use Case Table 39, SSD Fig. 21)
export default function LoginForm({ next }) {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in: go straight to the role's home page
  useEffect(() => {
    if (!loading && user) router.replace(safeNext(next) || homePathForRole(user.role));
  }, [loading, user, next, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      // Step 4: credentials verified and role identified by the server
      const loggedIn = await login(email, password);
      // Step 5: home page or dashboard according to the role
      router.replace(safeNext(next) || homePathForRole(loggedIn.role));
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
      title="Sign in"
      intro="Check crowd, weather and hazards before you travel."
      footer={<>No account yet? <Link href="/register" className="link">Create one</Link></>}
    >
      {error && <Notice tone="error" className="mb-6">{error}</Notice>}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
