"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from '@/lib/api';

const AuthContext = createContext(null);

// Restores the session from a stored token; resolves to the user or null
async function restoreSession() {
  if (!getToken()) return null;
  try {
    return (await api.me()).user;
  } catch {
    setToken(null);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    let cancelled = false;
    restoreSession().then((restored) => {
      if (cancelled) return;
      setUser(restored);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.login(email, password);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  // UC-01: the new tourist is signed in straight away
  const register = useCallback(async (details) => {
    const { token, user, message } = await api.register(details);
    setToken(token);
    setUser(user);
    return { user, message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // the local session is cleared either way
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
