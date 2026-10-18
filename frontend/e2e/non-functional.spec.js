// Non-functional requirements checked in the browser: SRS 3.3.1 (phone and desktop), 3.3.3 (security)
import { test, expect } from '@playwright/test';
import { DEMO, PLACES, openDestination, signIn } from './helpers.js';

test('ST-NF-01 every page sends the security headers', async ({ request }) => {
  const res = await request.get('/');
  const headers = res.headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['permissions-policy']).toContain('geolocation=(self)');
});

test('ST-NF-02 pages load without errors from the content security policy', async ({ page }) => {
  const violations = [];
  page.on('console', (m) => m.type() === 'error' && /Content Security Policy/i.test(m.text()) && violations.push(m.text()));
  await signIn(page, DEMO.tourist);
  await openDestination(page, PLACES.fairy.name);
  await page.goto('/destinations');
  await page.getByRole('button', { name: 'Map' }).click();
  await page.waitForTimeout(2000);
  expect(violations).toEqual([]);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('ST-NF-03 the main pages fit the screen without sideways scrolling', async ({ page }) => {
    await signIn(page, DEMO.tourist);
    for (const path of ['/', '/destinations', '/recommendations', '/profile']) {
      await page.goto(path);
      await page.waitForLoadState('load');
      await page.waitForTimeout(1000); // content filled in from the API
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });

  test('ST-NF-04 photos are loaded in a size that fits the phone', async ({ page }) => {
    await signIn(page, DEMO.tourist);
    await openDestination(page, PLACES.fairy.name);
    const hero = page.locator('section img').first();
    await expect(hero).toBeVisible();
    const src = await hero.evaluate((img) => img.currentSrc);
    expect(src).not.toContain('/1920px-');
  });
});
