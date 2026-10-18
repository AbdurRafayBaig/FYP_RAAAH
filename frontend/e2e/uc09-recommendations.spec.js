// UC-09 Get Alternative Destination Recommendations (Expanded Use Case Table 46) - FR-05.01 - FR-05.06
import { test, expect } from '@playwright/test';
import { DEMO, PLACES, openDestination, signIn } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await signIn(page, DEMO.tourist);
});

test('ST-09-01 alternatives to an unsafe destination are ranked, with the reasons', async ({ page }) => {
  await openDestination(page, PLACES.fairy.name);
  await page.getByRole('link', { name: 'See quieter alternatives' }).click();
  await expect(page.getByRole('heading', { name: 'Instead of Fairy Meadows' })).toBeVisible();
  const results = page.locator('ol > li');
  await expect(results.first()).toBeVisible();
  expect(await results.count()).toBeGreaterThan(0);
  await expect(results.first()).toContainText(/\d+%/);
  await expect(results.first()).toContainText(/Safer than your pick|Good for|places to stay/);
  // The selected destination is never offered as its own alternative
  await expect(results.locator('h2', { hasText: /^Fairy Meadows$/ })).toHaveCount(0);
});

test('ST-09-02 step 7: choosing a recommendation opens its page', async ({ page }) => {
  await openDestination(page, PLACES.fairy.name);
  await page.getByRole('link', { name: 'See quieter alternatives' }).click();
  const first = page.locator('ol > li').first();
  const name = (await first.locator('h2').innerText()).trim();
  await first.getByRole('link').click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
});

test('ST-09-03 alt 7a: the tourist can continue with the original destination', async ({ page }) => {
  await openDestination(page, PLACES.fairy.name);
  await page.getByRole('link', { name: 'See quieter alternatives' }).click();
  await page.getByRole('link', { name: 'Go to Fairy Meadows anyway' }).click();
  await expect(page.getByText('You chose to continue with Fairy Meadows.')).toBeVisible();
});

test('ST-09-04 recommendations can be asked for without picking a destination', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Alternatives' }).click();
  await expect(page.getByRole('heading', { name: 'Places that suit you' })).toBeVisible();
  await expect(page.locator('ol > li').first()).toBeVisible();
  // The demo tourist has not given location consent
  await expect(page.getByText(/Turn on location consent in your profile/)).toBeVisible();
});
