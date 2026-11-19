import { expect, test } from '@playwright/test';
import {
  accountButton,
  ageAccounts,
  bankLogins,
  expectAllUpToDate,
  login,
  logout,
  reset,
  restartBackend,
  setBank,
  setUp,
  totp,
  unlock,
  USER,
} from './helpers';

test.beforeEach(async ({ request }) => {
  await reset(request);
});

test('wrong password or code is rejected, the right ones lead to the PIN dialog', async ({
  page,
}) => {
  await login(page, 'wrong password');
  await expect(page.getByRole('alert')).toHaveText('Login failed.');

  const staleCode = totp(USER.totpSecret, Date.now() - 5 * 60_000);
  await login(page, USER.password, staleCode);
  await expect(page.getByRole('alert')).toHaveText('Login failed.');

  await login(page);
  await expect(page.getByRole('dialog', { name: 'Unlock bank access' })).toBeVisible();
});

test('PIN, then account selection without the loan account, then the dashboard', async ({
  page,
}) => {
  await login(page);
  await unlock(page);

  await expect(page.getByRole('heading', { name: 'Choose an account' })).toBeVisible();
  await expect(accountButton(page, 'Girokonto')).toBeVisible();
  await expect(accountButton(page, 'Tagesgeld')).toBeVisible();
  await expect(page.getByText('Darlehen')).toHaveCount(0);

  await accountButton(page, 'Girokonto').click();
  await expect(page.getByTestId('monthly-chart')).toBeVisible();
  await expectAllUpToDate(page);
  await expect(accountButton(page, 'Girokonto')).toHaveAttribute('aria-pressed', 'true');
});

test('a TAN request aborts the fetch and keeps the bank unlocked', async ({ page, request }) => {
  await setBank(request, { scenario: 'tan_required' });
  await login(page);
  await unlock(page);

  await expect(page.getByRole('alert')).toContainText('The bank requires an approval');
  await expect(page.getByRole('button', { name: 'Fetch now' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('wrong PIN is tried once, shown and forgotten', async ({ page, request }) => {
  await login(page);
  await unlock(page, '0000');

  const dialog = page.getByRole('dialog', { name: 'Unlock bank access' });
  await expect(dialog.getByRole('alert')).toHaveText(
    'The bank rejected the PIN. Please enter it again.',
  );
  expect(await bankLogins(request)).toBe(1);

  await dialog.getByRole('button', { name: 'Skip' }).click();
  await expect(page.getByRole('button', { name: 'Unlock bank access' })).toBeVisible();
  expect(await bankLogins(request)).toBe(1);
});

test('an unreachable bank is reported and the PIN is kept', async ({ page, request }) => {
  await setUp(page);
  await setBank(request, { scenario: 'unreachable' });

  await page.getByRole('button', { name: 'Fetch now' }).click();

  await expect(page.getByRole('alert')).toContainText('The bank is not reachable');
  await expect(page.getByTestId('bank-state')).toContainText('unlocked');
});

test('logging in again needs neither PIN nor account selection, until the bank is locked', async ({
  page,
}) => {
  await setUp(page);
  await logout(page);

  await login(page);
  await expect(page.getByTestId('monthly-chart')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(accountButton(page, 'Girokonto')).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Lock bank access' }).click();
  await expect(page.getByTestId('bank-state').getByText('locked', { exact: true })).toBeVisible();
  await logout(page);
  await login(page);
  await expect(page.getByRole('dialog', { name: 'Unlock bank access' })).toBeVisible();
});

test('after a backend restart the next login asks for the PIN again', async ({ page, request }) => {
  test.setTimeout(90_000);
  await setUp(page);

  await restartBackend(request);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  await login(page);

  await expect(page.getByRole('dialog', { name: 'Unlock bank access' })).toBeVisible();
});

test('a second fetch brings no new transactions', async ({ page }) => {
  await setUp(page);
  await expect(page.getByTestId('last-fetch')).not.toContainText(': 0 new');

  await page.getByRole('button', { name: 'Fetch now' }).click();

  await expect(page.getByTestId('last-fetch')).toContainText(': 0 new');
});

test('a gap is reported when the last fetch is older than 90 days', async ({ page, request }) => {
  await setUp(page);
  await expect(page.getByTestId('gap-warning')).toHaveCount(0);
  await ageAccounts(request, 100);

  await page.getByRole('button', { name: 'Fetch now' }).click();

  await expect(page.getByTestId('gap-warning')).toContainText('are missing');
});
