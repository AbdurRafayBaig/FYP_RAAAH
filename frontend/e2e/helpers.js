import { expect } from '@playwright/test';

// Demo accounts and places of backend/src/db/seedData.js
export const DEMO_PASSWORD = 'Raaah@2026';
export const DEMO = {
  tourist: 'tourist@raaah.pk',
  observer: 'observer@raaah.pk',
  admin: 'admin@raaah.pk',
  authority: 'authority@raaah.pk',
};
export const PLACES = {
  hunza: { name: 'Hunza Valley', latitude: 36.3236, longitude: 74.666 },
  fairy: { name: 'Fairy Meadows' },
  skardu: { name: 'Skardu' },
};
// Lahore - far outside every destination area
export const FAR_AWAY = { latitude: 31.52, longitude: 74.35 };

export async function signIn(page, email, password = DEMO_PASSWORD) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

// UC-01 up to the confirmation with the Tourist ID, where the new tourist chooses travel preferences
export async function fillRegistration(page) {
  const account = {
    fullName: 'Test Traveller',
    email: `e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`,
    password: 'Travel2026',
  };
  await page.goto('/register');
  await page.locator('#fullName').fill(account.fullName);
  await page.locator('#regEmail').fill(account.email);
  await page.locator('#regPassword').fill(account.password);
  await page.locator('#regConfirm').fill(account.password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/preferences\?welcome=1/);
  await expect(page.getByText('Your Tourist ID')).toBeVisible();
  return account;
}

export async function choosePreferences(page, interests) {
  for (const name of interests) await page.getByLabel(name, { exact: true }).check();
  await page.getByRole('button', { name: 'Save and continue' }).click();
  await expect(page).toHaveURL(/\/destinations/);
}

// A new tourist account with travel preferences, for tests that change a profile or check in
export async function registerTourist(page, interests = ['Nature']) {
  const account = await fillRegistration(page);
  await choosePreferences(page, interests);
  return account;
}

export async function giveLocationConsent(page) {
  await page.goto('/profile');
  await page.getByLabel(/may use my current location/).check();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Your profile and preferences have been saved.')).toBeVisible();
}

export async function openDestination(page, name) {
  await page.goto(`/destinations?search=${encodeURIComponent(name)}`);
  await page.getByRole('link', { name: new RegExp(`^${name}`) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
}

export const conditions = (page) => page.locator('section[aria-label="Current conditions"]');

export async function activeCheckIns(page) {
  const text = await conditions(page).innerText();
  return Number(text.match(/(\d+)\s*check-ins?\s/)[1]);
}
