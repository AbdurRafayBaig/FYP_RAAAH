// UC-05 Save Destination (Expanded Use Case Table 42) - FR-02.07; interface language
import { test, expect } from '@playwright/test';
import { PLACES, openDestination, registerTourist } from './helpers.js';

test('ST-05-01 a tourist saves a destination, sees it on the profile and can remove it (alt 3a)', async ({ page }) => {
  await registerTourist(page);
  await openDestination(page, PLACES.hunza.name);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Hunza Valley has been added to your saved destinations.')).toBeVisible();

  await page.goto('/profile');
  const saved = page.locator('section[aria-labelledby="saved-heading"]');
  await expect(saved.getByRole('link', { name: /^Hunza Valley/ })).toBeVisible();

  await openDestination(page, PLACES.hunza.name);
  await page.getByRole('button', { name: 'Saved', exact: true }).click();
  await expect(page.getByText('Hunza Valley has been removed from your saved destinations.')).toBeVisible();
  await page.goto('/profile');
  await expect(saved.getByText('Nothing saved yet.')).toBeVisible();
});

test('ST-LANG-01 the interface can be switched to Urdu and back', async ({ page }) => {
  await page.goto('/safety');
  await page.getByRole('button', { name: 'اردو میں دیکھیں' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1, name: 'حفاظت' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 2, name: 'ایمرجنسی میں' })).toBeVisible();

  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('heading', { level: 1, name: 'Safety' })).toBeVisible();
});
