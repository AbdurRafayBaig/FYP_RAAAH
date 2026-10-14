import { config } from '../src/config.js';
import { createApp } from '../src/app.js';
import { initCache } from '../src/data/cache.js';
import { runRefreshCycle } from '../src/modules/crowd/crowdService.js';

// Serverless entry point of the Application Server for the interim Vercel deployment (docs/DEPLOYMENT.md).
// src/server.js is the long-running entry point used locally and in the containers.
// A function cannot keep a timer running between requests, so the crowd refresh cycle of
// startRefreshJob() (FR-03.02 automatic check-out) runs here at most once per CROWD_REFRESH_SECONDS,
// before the request that finds it due.

const ready = initCache();
let lastRefresh = 0;

async function refreshIfDue() {
  if (Date.now() - lastRefresh < config.crowdRefreshSeconds * 1000) return;
  lastRefresh = Date.now();
  try {
    const { autoClosed } = await runRefreshCycle();
    if (autoClosed) console.log(`[crowd] Auto-closed ${autoClosed} expired check-in(s).`);
  } catch (err) {
    console.error('[crowd] Refresh cycle failed:', err.message);
  }
}

const app = createApp();

export default async function handler(req, res) {
  await ready;
  await refreshIfDue();
  return app(req, res);
}
