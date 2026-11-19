import { execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import path from 'node:path';
import { expect, type APIRequestContext, type Page } from '@playwright/test';

/** The user the backend creates in e2e mode. */
export const USER = {
  username: 'e2e',
  password: 'e2e-password',
  totpSecret: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
};
export const PIN = '12345';

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** RFC 6238 code, as an authenticator app would show it. */
export function totp(secret: string, now = Date.now()): string {
  let bits = '';
  for (const char of secret.replace(/=+$/, '')) {
    bits += BASE32.indexOf(char).toString(2).padStart(5, '0');
  }
  const bytes = bits.match(/.{8}/g)?.map((byte) => parseInt(byte, 2)) ?? [];
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 1000 / 30)));
  const hmac = createHmac('sha1', Buffer.from(bytes)).update(counter).digest();
  const offset = (hmac[hmac.length - 1] ?? 0) & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(code).padStart(6, '0');
}

export async function reset(request: APIRequestContext) {
  expect((await request.post('/api/_test/reset')).status()).toBe(204);
}

export async function setBank(
  request: APIRequestContext,
  control: { scenario?: 'ok' | 'tan_required' | 'unreachable'; days_ahead?: number },
) {
  const response = await request.put('/api/_test/bank', { data: control });
  expect(response.status()).toBe(204);
}

export async function bankLogins(request: APIRequestContext): Promise<number> {
  const state = (await (await request.get('/api/_test/bank')).json()) as { logins: number };
  return state.logins;
}

export async function ageAccounts(request: APIRequestContext, days: number) {
  expect((await request.post('/api/_test/age', { data: { days } })).status()).toBe(204);
}

export async function login(page: Page, password = USER.password, code = totp(USER.totpSecret)) {
  await page.goto('/');
  await page.getByLabel('User name').fill(USER.username);
  await page.getByLabel('Password').fill(password);
  await page.getByLabel('Code from the authenticator app').fill(code);
  await page.getByRole('button', { name: 'Log in' }).click();
}

export async function unlock(page: Page, pin = PIN) {
  await page.getByLabel('PIN').fill(pin);
  await page.getByRole('button', { name: 'Unlock' }).click();
}

export function accountButton(page: Page, name: 'Girokonto' | 'Tagesgeld') {
  return page.getByRole('button', { name: new RegExp(`^${name}`) });
}

/** Logs in, unlocks the bank and chooses the checking account; waits until all are fetched. */
export async function setUp(page: Page) {
  await login(page);
  await unlock(page);
  await accountButton(page, 'Girokonto').click();
  await expectAllUpToDate(page);
}

export async function expectAllUpToDate(page: Page) {
  const statuses = page.getByTestId('account-status');
  await expect(statuses).toHaveCount(2);
  await expect(statuses.nth(0)).toHaveText('up to date');
  await expect(statuses.nth(1)).toHaveText('up to date');
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
}

export function monthName(offset: number, style: 'long' | 'short' = 'long'): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return new Intl.DateTimeFormat('en', { month: style, year: 'numeric' }).format(date);
}

export function monthKey(offset: number): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Restarts the backend container of the e2e stack and waits until it answers again. */
export async function restartBackend(request: APIRequestContext) {
  const compose = path.resolve(import.meta.dirname, '../../docker-compose.e2e.yml');
  execFileSync('docker', ['compose', '-f', compose, 'restart', 'cashflow-backend'], {
    stdio: 'ignore',
  });
  await expect
    .poll(async () => (await request.get('/api/health')).status(), { timeout: 30_000 })
    .toBe(200);
}
