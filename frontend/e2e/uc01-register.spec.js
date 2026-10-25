// UC-01 Register Account (Expanded Use Case Table 38) - FR-01.01, FR-01.02, FR-01.04
import { test, expect } from '@playwright/test';
import { DEMO, choosePreferences, fillRegistration, signIn } from './helpers.js';

test('ST-01-01 a new tourist registers, sees the Tourist ID and then chooses travel preferences', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Create account' }).first().click();
  await expect(page).toHaveURL(/\/register$/);

  const account = await fillRegistration(page);
  await expect(page.getByText(/^RAH-\d{4}-\d{6}$/)).toBeVisible();
  await expect(page.getByText(`You are signed in as ${account.email}.`)).toBeVisible();
  await choosePreferences(page, ['Nature', 'Adventure']);

  await page.goto('/profile');
  await expect(page.getByLabel('Nature', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Adventure', { exact: true })).toBeChecked();
});

test('ST-01-02 alt 4b: missing information is highlighted field by field', async ({ page }) => {
  await page.goto('/register');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Please correct the highlighted fields.')).toBeVisible();
  for (const id of ['fullName', 'regEmail', 'regPassword']) {
    await expect(page.locator(`#${id}`)).toHaveClass(/field-error/);
  }
});

test('ST-01-03 alt 4a: an email that is already registered is refused and sign-in is offered', async ({ page }) => {
  await page.goto('/register');
  await page.locator('#fullName').fill('Second Account');
  await page.locator('#regEmail').fill(DEMO.tourist);
  await page.locator('#regPassword').fill('Travel2026');
  await page.locator('#regConfirm').fill('Travel2026');
  await page.getByRole('button', { name: 'Create account' }).click();
  const notice = page.getByText('This email is already registered. Please sign in instead.').first();
  await expect(notice).toBeVisible();
  await page.locator('form').locator('..').getByRole('link', { name: 'Sign in' }).first().click();
  await expect(page).toHaveURL(/\/login/);
});

test('ST-01-04 the new tourist can sign out from the confirmation page', async ({ page }) => {
  await fillRegistration(page);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login/);
});

test('ST-01-05 travel preferences can be skipped and are asked for again at the next sign-in', async ({ page }) => {
  const account = await fillRegistration(page);
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page).toHaveURL(/\/destinations/);
  await page.getByRole('button', { name: 'Sign out' }).first().click();
  await expect(page).toHaveURL(/\/login/);

  await signIn(page, account.email, account.password);
  await expect(page).toHaveURL(/\/preferences\?next=/);
  await expect(page.getByRole('heading', { name: 'What do you travel for?' })).toBeVisible();
});
