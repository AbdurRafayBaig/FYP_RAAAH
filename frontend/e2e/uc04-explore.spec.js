// UC-04 Explore Destinations (Expanded Use Case Table 41) - FR-02.01 - FR-02.06, FR-03.06, FR-06.03
import { test, expect } from '@playwright/test';
import { DEMO, PLACES, conditions, openDestination, signIn } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await signIn(page, DEMO.tourist);
});

test('ST-04-01 the destinations are listed with crowd level and safety status', async ({ page }) => {
  await page.goto('/destinations');
  await expect(page.getByText('14 destinations')).toBeVisible();
  await page.getByRole('button', { name: 'Table' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(14);
  await expect(page.locator('table tbody tr').first()).toContainText(/Low|Moderate|High|Critical/);
});

test('ST-04-02 searching narrows the list; alt 3a: no match says so', async ({ page }) => {
  await page.goto('/destinations');
  await page.getByLabel('Search destinations').fill('hunza');
  await expect(page.getByText(/^[1-9]\d* destinations?$/)).toBeVisible();
  await expect(page.getByRole('link', { name: /^Hunza Valley/ })).toBeVisible();

  await page.getByLabel('Search destinations').fill('no-such-place');
  await expect(page.getByText('No destinations found')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(page.getByText('14 destinations')).toBeVisible();
});

test('ST-04-03 the map view shows a map (FR-02.02)', async ({ page }) => {
  await page.goto('/destinations');
  await page.getByRole('button', { name: 'Map' }).click();
  await expect(page.locator('iframe[title="Map of Northern Pakistan"], .gm-style').first()).toBeVisible();
});

test('ST-04-04 the destination page shows crowd, weather, safety, road access and background', async ({ page }) => {
  await openDestination(page, PLACES.hunza.name);
  const now = conditions(page);
  for (const label of ['Crowd', 'Weather', 'Safety', 'Road access']) await expect(now).toContainText(label);
  await expect(now).toContainText(/\d+ check-ins? against a capacity of \d+/);
  await expect(page.getByRole('heading', { name: 'What to see' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Culture and history' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
});

test('ST-04-05 alt 6a: an unsafe destination shows a warning and offers alternatives', async ({ page }) => {
  await openDestination(page, PLACES.fairy.name);
  await expect(page.getByText('Safety warning')).toBeVisible();
  await expect(page.getByText(/verified hazard report: Landslide/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'See quieter alternatives' })).toBeVisible();
});

test('ST-04-06 alt 6a: a crowded destination shows a warning (demo crowd of Hunza Valley)', async ({ page }) => {
  await openDestination(page, PLACES.hunza.name);
  await expect(page.getByText('This place is busy right now')).toBeVisible();
});

test('ST-04-07 a destination that does not exist says so', async ({ page }) => {
  await page.goto('/destinations/99999');
  await expect(page.getByRole('heading', { name: 'Destination not found' })).toBeVisible();
});
