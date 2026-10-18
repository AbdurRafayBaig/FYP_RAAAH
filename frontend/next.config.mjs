import { WIKIMEDIA_WIDTHS } from './lib/imageLoader.mjs';

const isDev = process.env.NODE_ENV !== 'production';

// Address of the API, so the browser may call it (connect-src). "/api" is the same origin.
function apiOrigin() {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

// SRS 3.3.3 - the browser only loads scripts, data, photos and maps from the places RAAAH uses.
// Google Maps entries follow Google's content security policy guide for the Maps JavaScript API.
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js adds small inline scripts to every page; development also needs eval for hot reload
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://maps.googleapis.com https://*.gstatic.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://thumb.wikimedia.org https://upload.wikimedia.org https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com",
  `connect-src 'self' ${apiOrigin()} https://*.googleapis.com https://*.google.com https://*.gstatic.com data: blob:`,
  'frame-src https://maps.google.com https://www.google.com',
  'worker-src blob:',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Location is asked for by this site only, for check-in and distances (FR-01.07)
  { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=(), payment=()' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server in .next/standalone for the Web Server container (Deployment Diagram, Fig. 45).
  // Vercel builds the app with its own output format, so it is left alone there.
  output: process.env.VERCEL ? undefined : 'standalone',
  poweredByHeader: false,
  images: {
    // Photos come straight from Wikimedia Commons in the width that fits the screen (lib/imageLoader.mjs)
    loader: 'custom',
    loaderFile: './lib/imageLoader.mjs',
    deviceSizes: WIKIMEDIA_WIDTHS.filter((w) => w >= 500),
    imageSizes: [32, 64, 128, ...WIKIMEDIA_WIDTHS.filter((w) => w < 500)],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
