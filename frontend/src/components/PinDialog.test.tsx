import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PinDialog } from './PinDialog';

function renderDialog(props: Partial<Parameters<typeof PinDialog>[0]> = {}) {
  const handlers = { onUnlock: vi.fn(), onSkip: vi.fn() };
  render(<PinDialog open rejected={false} pending={false} {...handlers} {...props} />);
  return handlers;
}

describe('PinDialog', () => {
  it('hands the PIN over and forgets it', async () => {
    const { onUnlock } = renderDialog();
    const input = screen.getByLabelText('PIN');

    await userEvent.type(input, '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Unlock' }));

    expect(onUnlock).toHaveBeenCalledExactlyOnceWith('12345');
    expect(input).toHaveValue('');
  });

  it('does not submit an empty PIN', async () => {
    const { onUnlock } = renderDialog();

    expect(screen.getByRole('button', { name: 'Unlock' })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('PIN'), '{Enter}');

    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('can be skipped', async () => {
    const { onSkip, onUnlock } = renderDialog();

    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));

    expect(onSkip).toHaveBeenCalledOnce();
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('says when the bank rejected the PIN', () => {
    renderDialog({ rejected: true });

    expect(screen.getByRole('alert')).toHaveTextContent('The bank rejected the PIN');
  });

  it('masks the PIN', () => {
    renderDialog();

    expect(screen.getByLabelText('PIN')).toHaveAttribute('type', 'password');
  });
});
