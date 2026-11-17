import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HealthStatus } from './HealthStatus';

function renderWithQuery() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <HealthStatus />
    </QueryClientProvider>,
  );
}

function mockFetch(status: number, body: unknown) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

describe('HealthStatus', () => {
  it('shows "checking" until the backend answers', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    renderWithQuery();

    expect(screen.getByRole('status')).toHaveTextContent('checking …');
  });

  it('shows "connected" when backend and database are up', async () => {
    const fetch = mockFetch(200, { status: 'ok', database: 'ok' });
    renderWithQuery();

    expect(await screen.findByText('connected')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/health');
  });

  it('shows that the database is unreachable', async () => {
    mockFetch(503, { status: 'unavailable', database: 'unreachable' });
    renderWithQuery();

    expect(await screen.findByText('database unreachable')).toBeInTheDocument();
  });

  it('shows that the backend is not reachable', async () => {
    mockFetch(502, {});
    renderWithQuery();

    expect(await screen.findByText('not reachable')).toBeInTheDocument();
  });
});
