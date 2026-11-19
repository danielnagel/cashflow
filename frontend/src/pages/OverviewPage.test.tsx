import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, renderWithProviders, type ApiMock } from '@/test-utils';
import { OverviewPage } from './OverviewPage';

const TODAY = new Date(2026, 10, 17);

function summaryRequests(fetch: ApiMock) {
  return fetch.mock.calls
    .map(([input]) => new URL(typeof input === 'string' ? input : '/', 'http://localhost'))
    .filter((url) => url.pathname === '/api/summary/monthly')
    .map((url) => `${url.searchParams.get('from') ?? ''}..${url.searchParams.get('to') ?? ''}`);
}

describe('OverviewPage', () => {
  it('starts with the current month and the three before it', async () => {
    const fetch = mockApi({ '/api/summary/monthly': [] });
    renderWithProviders(<OverviewPage accountId="checking" today={TODAY} />);

    expect(screen.getByTestId('chart-range')).toHaveTextContent('August 2026 – November 2026');
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Today' })).toBeDisabled();
    await waitFor(() => {
      expect(summaryRequests(fetch)).toEqual(['2026-08..2026-11']);
    });
  });

  it('pages into the past, back again and jumps to today', async () => {
    const fetch = mockApi({ '/api/summary/monthly': [] });
    renderWithProviders(<OverviewPage accountId="checking" today={TODAY} />);
    const previous = screen.getByRole('button', { name: 'Previous month' });
    const next = screen.getByRole('button', { name: 'Next month' });

    await userEvent.click(previous);
    await userEvent.click(previous);
    expect(screen.getByTestId('chart-range')).toHaveTextContent('June 2026 – September 2026');
    expect(next).toBeEnabled();

    await userEvent.click(next);
    expect(screen.getByTestId('chart-range')).toHaveTextContent('July 2026 – October 2026');

    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByTestId('chart-range')).toHaveTextContent('August 2026 – November 2026');
    expect(next).toBeDisabled();
    await waitFor(() => {
      expect(summaryRequests(fetch)).toContain('2026-06..2026-09');
    });
  });
});
