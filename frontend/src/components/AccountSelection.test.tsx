import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { account } from '@/test-utils';
import { AccountSelection } from './AccountSelection';
import { AccountSwitcher } from './AccountSwitcher';

const CHECKING = account();
const SAVINGS = account({
  id: 'savings',
  iban: 'DE95123456780000005678',
  name: 'Tagesgeld',
  product_name: 'Tagesgeld',
});

describe('AccountSelection', () => {
  it('offers every account and reports the choice', async () => {
    const onSelect = vi.fn();
    render(<AccountSelection accounts={[CHECKING, SAVINGS]} pending={false} onSelect={onSelect} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('DE95 1234 5678 0000 0056 78 · Erika Mustermann')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: /Tagesgeld/ }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('savings');
  });
});

describe('AccountSwitcher', () => {
  it('marks the chosen account and switches to another one', async () => {
    const onSelect = vi.fn();
    render(
      <AccountSwitcher accounts={[CHECKING, SAVINGS]} selectedId="checking" onSelect={onSelect} />,
    );
    const checking = screen.getByRole('button', { name: /Girokonto ··· 1234/ });
    const savings = screen.getByRole('button', { name: /Tagesgeld ··· 5678/ });

    expect(checking).toHaveAttribute('aria-pressed', 'true');
    expect(savings).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(checking);
    expect(onSelect).not.toHaveBeenCalled();
    await userEvent.click(savings);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('savings');
  });

  it('shows the fetch status of every account', () => {
    render(
      <AccountSwitcher
        accounts={[
          account({ id: 'a', fetch: { state: 'done', error: null } }),
          account({ id: 'b', fetch: { state: 'fetching', error: null } }),
          account({ id: 'c', fetch: { state: 'queued', error: null } }),
          account({ id: 'd', fetch: { state: 'failed', error: 'bank_unreachable' } }),
          account({ id: 'e' }),
          account({
            id: 'f',
            last_run: {
              finished_at: '2026-11-17T09:30:00Z',
              new_count: 1,
              skipped_count: 2,
              warning: null,
            },
          }),
        ]}
        selectedId="a"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId('account-status').map((s) => s.textContent)).toEqual([
      'up to date',
      'updating …',
      'updating …',
      'update failed',
      'not fetched yet',
      expect.stringMatching(/^as of Nov 17, 2026/),
    ]);
  });
});
