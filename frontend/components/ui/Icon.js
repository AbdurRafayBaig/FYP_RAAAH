// A handful of line icons, used sparingly
const PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  alert: <path d="M12 4l9 16H3L12 4zM12 10v4M12 17.2v.1" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  next: <path d="M9 5l7 7-7 7" />,
  previous: <path d="M15 5l-7 7 7 7" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0113 0C18.5 15 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </>
  ),
  mountain: <path d="M3 19l6.5-11 4 6.5 2.5-3.5L21 19H3z" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  bed: <path d="M3 18v-9M3 14h18v4M21 14v-2.5a2.5 2.5 0 00-2.5-2.5H11v5M7 12.2a1.6 1.6 0 100-.01" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0111 0M15.5 5.8a3 3 0 010 5.4M17 14.2a5.5 5.5 0 013.5 4.8" />
    </>
  ),
  cloud: <path d="M7 18h10.5a3.5 3.5 0 00.4-6.98A5.5 5.5 0 007.3 9.6 4.2 4.2 0 007 18z" />,
  shield: <path d="M12 3.5l7 2.5v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6l7-2.5z" />,
  road: <path d="M8 3.5L5 20.5M16 3.5l3 17M12 5v2.5M12 11v2.5M12 17v2.5" />,
  share: (
    <>
      <circle cx="17.5" cy="6" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="M8.7 10.8l6.6-3.6M8.7 13.2l6.6 3.6" />
    </>
  ),
  bookmark: <path d="M7 4h10v16.5l-5-3.6-5 3.6V4z" />,
  bookmarkFilled: <path d="M7 4h10v16.5l-5-3.6-5 3.6V4z" fill="currentColor" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  eyeOff: <path d="M4 4l16 16M10 6a8.7 8.7 0 012-.5c6 0 9.5 6.5 9.5 6.5a16 16 0 01-2.7 3.4M6.6 7.6C4 9.4 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1.1M10 10a2.8 2.8 0 004 4" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5S9.6 6.1 12 3.5z" />
    </>
  ),
  map: <path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2v-13zM9 4.5v13M15 6.5v13" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5v3a2 2 0 01-2 2A15.5 15.5 0 014.5 5.5a2 2 0 012-2z" />,
  filters: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4.5v5M10 14.5v5" />,
  offline: <path d="M4 4l16 16M8.5 8.8A7.5 7.5 0 0012 8c2.3 0 4.4.9 6 2.5M5.5 11.8a9 9 0 012.6-1.8M9 15a4.4 4.4 0 016 0M12 19h.01" />,
};

// Icons that point a direction are mirrored when the page is right-to-left (Urdu)
const DIRECTIONAL = new Set(['arrow', 'back', 'next', 'previous']);

export default function Icon({ name, size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${DIRECTIONAL.has(name) ? 'rtl:-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
