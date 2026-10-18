import { defineConfig } from '@playwright/test';

// System tests in the browser (docs/TESTING.md). They expect the whole system running with fresh demo
// data: `npm run db:reset` in backend/, then the API, the AI engine and the web client.
export default defineConfig({
  testDir: './e2e',
  // One tourist at a time: the tests change crowd levels that later tests read
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    // "msedge" or "chrome" uses the browser installed on this computer instead of a downloaded one
    channel: process.env.E2E_BROWSER_CHANNEL || undefined,
    viewport: { width: 1366, height: 860 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
