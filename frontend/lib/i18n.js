// Interface language: English (default) or Urdu. The English text is the key, so a string without an
// Urdu translation is simply shown in English. Destination content from the database stays in English.
import { UR } from './i18n-ur';

export const LANGUAGES = ['en', 'ur'];
export const LANG_COOKIE = 'raaah_lang';

export const normaliseLang = (value) => (value === 'ur' ? 'ur' : 'en');
export const dirFor = (lang) => (lang === 'ur' ? 'rtl' : 'ltr');

// translate('Welcome, {name}', 'ur', { name: 'Ali' })
export function translate(text, lang, values) {
  let out = lang === 'ur' && UR[text] ? UR[text] : text;
  if (values) for (const [k, v] of Object.entries(values)) out = out.replaceAll(`{${k}}`, v);
  return out;
}

export const makeT = (lang) => (text, values) => translate(text, lang, values);
