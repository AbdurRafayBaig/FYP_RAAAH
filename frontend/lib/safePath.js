// Only a path on this site is accepted as the page to continue to after sign-in (no open redirect).
// Browsers read "/\evil.com" like "//evil.com", so backslashes and control characters are refused too.
export function safeNextPath(next) {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//')) return '';
  if (/[\\\u0000-\u001f\u007f]/.test(next)) return '';
  try {
    const url = new URL(next, 'https://raaah.invalid');
    return url.origin === 'https://raaah.invalid' ? `${url.pathname}${url.search}${url.hash}` : '';
  } catch {
    return '';
  }
}
