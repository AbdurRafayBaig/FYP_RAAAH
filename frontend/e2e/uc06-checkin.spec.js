// UC-06 Check In at Destination (Expanded Use Case Table 43) - FR-01.07, FR-03.01, FR-03.04, FR-03.06
import { test, expect } from '@playwright/test';
import { DEMO, FAR_AWAY, PLACES, activeCheckIns, giveLocationConsent, openDestination, registerTourist, signIn } from './helpers.js';

test('ST-06-01 pre-condition: without location consent the tourist is sent to the profile', async ({ page }) => {
  await signIn(page, DEMO.tourist); // demo tourist has not given consent
  await openDestination(page, PLACES.hunza.name);
  await expect(page.getByText('Check-in uses your location, so it needs your consent first.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Check in at/ })).toHaveCount(0);
});

test.describe('standing in Hunza Valley', () => {
  test.use({ geolocation: { latitude: PLACES.hunza.latitude, longitude: PLACES.hunza.longitude }, permissions: ['geolocation'] });

  test('ST-06-02 normal flow: the check-in is recorded and the crowd count goes up by one', async ({ page }) => {
    await registerTourist(page);
    await giveLocationConsent(page);
    await openDestination(page, PLACES.hunza.name);
    const before = await activeCheckIns(page);

    await page.getByRole('button', { name: 'Check in at Hunza Valley' }).click();
    await expect(page.getByText(/You are checked in at Hunza Valley\./)).toBeVisible();
    await expect(page.getByText('You have been checked in here since')).toBeVisible();
    expect(await activeCheckIns(page)).toBe(before + 1);
  });
});

test.describe('far away from every destination', () => {
  test.use({ geolocation: FAR_AWAY, permissions: ['geolocation'] });

  test('ST-06-03 alt 3a: a tourist outside the destination area is rejected', async ({ page }) => {
    await registerTourist(page);
    await giveLocationConsent(page);
    await openDestination(page, PLACES.skardu.name);
    await page.getByRole('button', { name: 'Check in at Skardu' }).click();
    await expect(page.getByText(/Check-in rejected: you are about [\d.]+ km from Skardu/)).toBeVisible();
  });
});

test.describe('location permission denied', () => {
  test.use({ permissions: [] });

  test('ST-06-04 alt 2a: the tourist is told that check-in requires the location', async ({ page }) => {
    await registerTourist(page);
    await giveLocationConsent(page);
    await openDestination(page, PLACES.skardu.name);
    await page.getByRole('button', { name: 'Check in at Skardu' }).click();
    await expect(page.getByText(/Check-in requires your location|Your location could not be found/)).toBeVisible();
  });
});
