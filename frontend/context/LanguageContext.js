"use client";

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANG_COOKIE, dirFor, makeT, normaliseLang } from '@/lib/i18n';

const LanguageContext = createContext({ lang: 'en', t: makeT('en'), setLang: () => {} });

export function LanguageProvider({ initialLang, children }) {
  const router = useRouter();
  const [lang, setLangState] = useState(normaliseLang(initialLang));

  const setLang = useCallback((next) => {
    const value = normaliseLang(next);
    document.cookie = `${LANG_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = value;
    document.documentElement.dir = dirFor(value);
    setLangState(value);
    // Server-rendered parts of the page (home, safety, footer) are rendered again in the new language
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({ lang, t: makeT(lang), setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;
