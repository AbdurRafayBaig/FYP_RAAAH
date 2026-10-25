import { createClient } from 'redis';
import { config } from '../config.js';

// Cache Access (Package Diagram, Data Access Layer).
// Crowd levels and destination status are cached in Redis (SRS 3.3.7).
// When REDIS_URL is not configured an in-memory store with the same interface is used.

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, ttlSeconds) {
    this.store.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
  }

  async del(key) {
    this.store.delete(key);
  }
}

class RedisCache {
  constructor(client) {
    this.client = client;
  }

  async get(key) {
    const raw = await this.client.get(key);
    return raw === null ? null : JSON.parse(raw);
  }

  async set(key, value, ttlSeconds) {
    const raw = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, raw, { EX: ttlSeconds });
    else await this.client.set(key, raw);
  }

  async del(key) {
    await this.client.del(key);
  }
}

let cache = new MemoryCache();
let cacheKind = 'memory';

export async function initCache() {
  if (!config.redisUrl) {
    console.log('[cache] REDIS_URL not set; using in-memory cache.');
    return;
  }
  try {
    const client = createClient({ url: config.redisUrl });
    client.on('error', (err) => console.error('[cache] Redis error:', err.message));
    await client.connect();
    cache = new RedisCache(client);
    cacheKind = 'redis';
    console.log('[cache] Connected to Redis.');
  } catch (err) {
    console.warn(`[cache] Could not connect to Redis (${err.message}); using in-memory cache.`);
  }
}

export const cacheKeys = {
  crowd: (destinationId) => `crowd:${destinationId}`,
  revokedToken: (jti) => `revoked-token:${jti}`,
  forecast: (destinationId) => `forecast:${destinationId}`,
};

export function getCache() {
  return cache;
}

export function getCacheKind() {
  return cacheKind;
}
