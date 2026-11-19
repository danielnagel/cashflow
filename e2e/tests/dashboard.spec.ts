import { expect, test, type Page } from '@playwright/test';
import {
  accountButton,
  expectAllUpToDate,
  monthKey,
  monthName,
  reset,
  setBank,
  setUp,
} from './helpers';

test.beforeEach(async ({ request, page }) => {
  await reset(request);
  await setUp(page);
});

function bar(page: Page, kind: 'Income' | 'Expenses', monthOffset: number) {
  return page.getByRole('button', { name: new RegExp(`^${kind} ${monthName(monthOffset)}: `) });
}

test('paging through the months and back to today', async ({ page }) => {
  const range = page.getByTestId('chart-range');
  const next = page.getByRole('button', { name: 'Next month' });
  await expect(range).toHaveText(`${monthName(-3)} – ${monthName(0)}`);
  await expect(next).toBeDisabled();

  await page.getByRole('button', { name: 'Previous month' }).click();
  await page.getByRole('button', { name: 'Previous month' }).click();
  await expect(range).toHaveText(`${monthName(-5)} – ${monthName(-2)}`);

  await next.click();
  await expect(range).toHaveText(`${monthName(-4)} – ${monthName(-1)}`);
  await page.getByRole('button', { name: 'Today' }).click();
  await expect(range).toHaveText(`${monthName(-3)} – ${monthName(0)}`);
  await expect(next).toBeDisabled();
});

test('clicking a bar lists its transactions', async ({ page }) => {
  await bar(page, 'Expenses', -1).click();
  const expenses = page.getByRole('region', { name: `Expenses ${monthName(-1)}` });
  await expect(expenses.getByRole('row', { name: /Hausverwaltung Beispiel/ })).toContainText(
    '-€950.00',
  );
  await expect(expenses.getByRole('row', { name: /Muster Software GmbH/ })).toHaveCount(0);

  await bar(page, 'Income', -1).click();
  const income = page.getByRole('region', { name: `Income ${monthName(-1)}` });
  await expect(income.getByRole('row', { name: /Muster Software GmbH/ })).toContainText(
    '€3,245.67',
  );
});

test('the account switcher shows the data of the other account', async ({ page }) => {
  await expect(bar(page, 'Income', -1)).toHaveAccessibleName(/€3,245\.67/);

  await accountButton(page, 'Tagesgeld').click();

  await expect(accountButton(page, 'Tagesgeld')).toHaveAttribute('aria-pressed', 'true');
  // 200.00 by standing order, plus interest in December.
  await expect(bar(page, 'Income', -1)).toHaveAccessibleName(/: €2\d\d\.\d\d$/);
});

test('identical double bookings appear exactly twice', async ({ page }) => {
  await page.getByRole('link', { name: 'Transactions' }).click();
  await page.getByLabel('Search name or purpose').fill('BAECKEREI');

  const rows = page.getByTestId('transaction-row');
  await expect(rows.first()).toContainText('BAECKEREI KORN');
  await expect(rows.filter({ hasNotText: 'BAECKEREI KORN' })).toHaveCount(0);
  const dates = await rows.locator('td:first-child').allTextContents();
  const perDay = Object.values(
    dates.reduce<Record<string, number>>((count, day) => {
      count[day] = (count[day] ?? 0) + 1;
      return count;
    }, {}),
  );
  expect(perDay.length).toBeGreaterThan(1);
  expect(new Set(perDay)).toEqual(new Set([2]));
});

test('pending transactions are marked, not summed up, and booked exactly once', async ({
  page,
  request,
}) => {
  await page.getByRole('link', { name: 'Transactions' }).click();
  const pending = page.getByTestId('pending-row');
  await expect(pending.first()).toContainText('pending');
  const [date = '', name = ''] = (await pending.first().locator('td').allTextContents()).map((c) =>
    c.replace('pending', '').trim(),
  );
  const amount = (await pending.first().locator('td').nth(3).textContent()) ?? '';
  const matching = (rows: typeof pending) =>
    rows.filter({ hasText: date }).filter({ hasText: name }).filter({ hasText: amount });
  const twins = await matching(pending).count();

  // The month total contains booked transactions only.
  const accounts = (await (await page.request.get('/api/accounts')).json()) as {
    selected_id: string;
  };
  const month = monthKey(0);
  const summary = (await (
    await page.request.get(
      `/api/summary/monthly?account_id=${accounts.selected_id}&from=${month}&to=${month}`,
    )
  ).json()) as { expense: string }[];
  const booked = (await (
    await page.request.get(
      `/api/transactions?account_id=${accounts.selected_id}&month=${month}&type=expense&page_size=200`,
    )
  ).json()) as { items: { amount: string }[] };
  const bookedSum = booked.items.reduce((sum, t) => sum - Number(t.amount), 0);
  expect(Number(summary[0]?.expense)).toBeCloseTo(bookedSum, 2);

  await setBank(request, { days_ahead: 10 });
  await page.getByRole('button', { name: 'Fetch now' }).click();
  await expectAllUpToDate(page);

  await expect(matching(page.getByTestId('transaction-row'))).toHaveCount(twins);
  await expect(matching(pending)).toHaveCount(0);
});
