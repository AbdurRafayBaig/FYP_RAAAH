// UC-03 Manage Profile and Preferences (Expanded Use Case Table 40) - FR-01.04, FR-01.05, FR-01.07
import { test, expect } from '@playwright/test';
import { registerTourist } from './helpers.js';

test('ST-03-01 the profile shows the details, Tourist ID, preferences and location consent', async ({ page }) => {
  const account = await registerTourist(page, ['Nature', 'Culture']);
  await page.goto('/profile');
  await expect(page.locator('#fullName')).toHaveValue(account.fullName);
  await expect(page.locator('#email')).toHaveValue(account.email);
  await expect(page.getByText(/^RAH-\d{4}-\d{6}$/)).toBeVisible();
  await expect(page.getByLabel('Nature', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Culture', { exact: true })).toBeChecked();
  await expect(page.getByLabel(/may use my current location/)).not.toBeChecked();
});

test('ST-03-02 changes are saved and still there after reloading', async ({ page }) => {
  await registerTourist(page);
  await page.goto('/profile');
  await page.locator('#fullName').fill('Renamed Traveller');
  await page.getByLabel('Photography', { exact: true }).check();
  await page.getByLabel(/may use my current location/).check();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Your profile and preferences have been saved.')).toBeVisible();

  await page.reload();
  await expect(page.locator('#fullName')).toHaveValue('Renamed Traveller');
  await expect(page.getByLabel('Photography', { exact: true })).toBeChecked();
  await expect(page.getByLabel(/may use my current location/)).toBeChecked();
});

test('ST-03-03 alt 4a: invalid information shows an error and the previous values are kept', async ({ page }) => {
  const account = await registerTourist(page);
  await page.goto('/profile');
  await page.locator('#fullName').fill('');
  await page.locator('#email').fill('not-an-email');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Some information is invalid. Your previous values have been kept.')).toBeVisible();

  await page.reload();
  await expect(page.locator('#fullName')).toHaveValue(account.fullName);
  await expect(page.locator('#email')).toHaveValue(account.email);
});
