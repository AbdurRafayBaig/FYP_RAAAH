// RAAAH service worker: keeps the pages, destination data and photos a traveller has opened, so they
// can still be read where the mountains have no signal. The safety page (emergency numbers) is stored
// when the site is first opened. Data of the signed-in user is deleted when they sign out.
const VERSION = 'v1';
const PAGES = `raaah-pages-${VERSION}`;
const ASSETS = `raaah-assets-${VERSION}`;
const API = 'raaah-api';
const IMAGES = 'raaah-images';
const KEEP = [PAGES, ASSETS, API, IMAGES];
const MAX_IMAGES = 40;
// API reads worth keeping offline; everything else always goes to the network
const API_READS = /\/api\/(auth\/me|interests|profile(\/saved)?|destinations(\/\d+)?)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(['/safety'])).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('raaah-') && !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'clear-user-data') event.waitUntil(caches.delete(API));
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = (await cache.match(request, { ignoreVary: true })) || (fallbackUrl && (await caches.match(fallbackUrl)));
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    await cache.put(request, response.clone());
    if (maxEntries) {
      const keys = await cache.keys();
      await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((k) => cache.delete(k)));
    }
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES, '/safety'));
  } else if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (API_READS.test(url.pathname)) {
    event.respondWith(networkFirst(request, API));
  } else if (url.hostname === 'thumb.wikimedia.org') {
    event.respondWith(cacheFirst(request, IMAGES, MAX_IMAGES));
  }
});
