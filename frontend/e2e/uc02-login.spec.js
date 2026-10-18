// UC-02 Login (Expanded Use Case Table 39) - FR-01.03, SRS 3.3.3
import { test, expect } from '@playwright/test';
import { DEMO, signIn } from './helpers.js';

const ROLES = [
  { email: DEMO.tourist, home: '/', shows: 'Alternatives', hides: 'Dashboard' },
  { email: DEMO.observer, home: '/', shows: 'Alternatives', hides: 'Dashboard' },
  { email: DEMO.admin, home: '/analytics-dashboard', shows: 'Dashboard', hides: 'Alternatives' },
  { email: DEMO.authority, home: '/analytics-dashboard', shows: 'Dashboard', hides: 'Alternatives' },
];

for (const role of ROLES) {
  test(`ST-02-01 ${role.email} lands on the page of the role, with the features of the role`, async ({ page }) => {
    await signIn(page, role.email);
    await expect(page).toHaveURL(new RegExp(`${role.home}$`));
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.getByRole('link', { name: role.shows })).toBeVisible();
    await expect(nav.getByRole('link', { name: role.hides })).toHaveCount(0);
  });
}

test('ST-02-02 alt 4a: a wrong password shows an error and the user stays on the sign-in page', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill(DEMO.tourist);
  await page.locator('#password').fill('not-the-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test('ST-02-03 a tourist cannot open the dashboard', async ({ page }) => {
  await signIn(page, DEMO.tourist);
  await page.goto('/analytics-dashboard');
  await expect(page.getByText('Access denied')).toBeVisible();
});

test('ST-02-04 signing out ends the session and protected pages ask to sign in again', async ({ page }) => {
  await signIn(page, DEMO.observer);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login/);
  expect(await page.evaluate(() => localStorage.getItem('raaah_token'))).toBeNull();
  await page.goto('/recommendations');
  await expect(page).toHaveURL(/\/login\?next=%2Frecommendations/);
});
