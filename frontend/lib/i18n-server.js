import { cookies } from 'next/headers';
import { LANG_COOKIE, makeT, normaliseLang } from './i18n';

// Language of the current request, for server components
export async function getLang() {
  return normaliseLang((await cookies()).get(LANG_COOKIE)?.value);
}

export async function getT() {
  return makeT(await getLang());
}
