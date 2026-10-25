// SRS 3.3.3 - forgot password: the link itself is emailed, so the browser tests cover the pages only
// (the full flow with the emailed token is tested in backend/tests/integration/password-reset.test.js)
import { test, expect } from '@playwright/test';
import { DEMO } from './helpers.js';

test('ST-02-05 the sign-in page leads to the reset form, which answers without telling whether the account exists', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: 'Forgot your password?' }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);

  await page.locator('#resetEmail').fill(DEMO.tourist);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  const answer = page.getByText(/If an account exists for this email/);
  await expect(answer).toBeVisible();
  const known = await answer.innerText();

  await page.goto('/forgot-password');
  await page.locator('#resetEmail').fill('nobody.here@example.com');
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByText(/If an account exists for this email/)).toHaveText(known);
});

test('ST-02-06 a reset link that is not valid is refused and a new one is offered', async ({ page }) => {
  await page.goto(`/reset-password?token=${'x'.repeat(43)}`);
  await page.locator('#newPassword').fill('Mountain2026');
  await page.locator('#newPasswordConfirm').fill('Mountain2026');
  await page.getByRole('button', { name: 'Save new password' }).click();
  await expect(page.getByText('This link is not valid any more.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ask for a new link' })).toBeVisible();
});
