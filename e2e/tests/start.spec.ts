import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const response = await request.post('/api/_test/reset');
  expect(response.status()).toBe(204);
});

test('start page loads and shows the backend as connected', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('cashflow');
  await expect(page.getByRole('heading', { name: 'cashflow' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('connected');
});

test('health endpoint is reachable through the frontend proxy', async ({ request }) => {
  const response = await request.get('/api/health');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', database: 'ok' });
});

test('unknown routes fall back to the app', async ({ page }) => {
  await page.goto('/some/deep/link');

  await expect(page.getByRole('heading', { name: 'cashflow' })).toBeVisible();
});
