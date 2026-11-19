import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { vi, type MockInstance } from 'vitest';
import type { Account } from '@/lib/api';
import { createQueryClient } from '@/lib/query-client';

export function renderWithProviders(ui: ReactElement) {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

export type ApiMock = MockInstance<typeof fetch>;

/** Answers fetch calls by path (without query string); unknown paths fail the test. */
export function mockApi(routes: Record<string, unknown>): ApiMock {
  return vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
    const url = new URL(
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
      'http://localhost',
    );
    if (!(url.pathname in routes)) {
      return Promise.reject(new Error(`Unexpected request to ${url.pathname}`));
    }
    return Promise.resolve(new Response(JSON.stringify(routes[url.pathname]), { status: 200 }));
  });
}

export function account(overrides: Partial<Account> = {}): Account {
  return {
    id: 'checking',
    iban: 'DE94123456780000001234',
    name: 'Girokonto',
    product_name: 'Girokonto',
    owner_name: 'Erika Mustermann',
    covered_from: '2026-08-20',
    covered_to: '2026-11-17',
    fetch: { state: 'idle', error: null },
    last_run: null,
    gaps: [],
    balance: null,
    ...overrides,
  };
}
