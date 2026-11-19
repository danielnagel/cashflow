import { describe, expect, it } from 'vitest';
import { addMonths, monthOf, monthWindow } from './months';

describe('months', () => {
  it('takes the month of a date', () => {
    expect(monthOf(new Date(2026, 0, 31))).toBe('2026-01');
  });

  it('adds and subtracts months across years', () => {
    expect(addMonths('2026-11', 2)).toBe('2027-01');
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(addMonths('2026-03', -15)).toBe('2024-12');
  });

  it('shows the current month and the three before it', () => {
    expect(monthWindow('2026-11', 0, 4)).toEqual({
      from: '2026-08',
      to: '2026-11',
      months: ['2026-08', '2026-09', '2026-10', '2026-11'],
    });
  });

  it('moves into the past one month per step', () => {
    expect(monthWindow('2026-02', 2, 4)).toEqual({
      from: '2025-09',
      to: '2025-12',
      months: ['2025-09', '2025-10', '2025-11', '2025-12'],
    });
  });

  it('never goes beyond the current month', () => {
    expect(monthWindow('2026-11', -3, 4).to).toBe('2026-11');
  });
});
