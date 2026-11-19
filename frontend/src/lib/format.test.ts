import { describe, expect, it } from 'vitest';
import {
  formatAmount,
  formatDate,
  formatDifference,
  formatIban,
  formatMonth,
  parseDay,
} from './format';

describe('formatAmount', () => {
  it('shows euros with cents and the sign of debits', () => {
    expect(formatAmount('1234.5', 'en')).toBe('€1,234.50');
    expect(formatAmount('-3.50', 'en')).toBe('-€3.50');
    expect(formatAmount('0', 'en')).toBe('€0.00');
  });

  it('follows the language', () => {
    expect(formatAmount('-1234.5', 'de')).toBe('-1.234,50\u00a0€');
  });
});

describe('formatDifference', () => {
  it('rounds to whole euros and always shows the sign', () => {
    expect(formatDifference('312.49', 'en')).toBe('+€312');
    expect(formatDifference('-80.5', 'en')).toBe('-€81');
    expect(formatDifference('0', 'en')).toBe('€0');
  });
});

describe('dates', () => {
  it('reads a booking date as a calendar day, independent of the time zone', () => {
    const day = parseDay('2026-10-01');

    expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([2026, 9, 1]);
    expect(formatDate('2026-10-01', 'en')).toBe('Oct 1, 2026');
    expect(formatDate('2026-10-01', 'de')).toBe('01.10.2026');
  });

  it('names months', () => {
    expect(formatMonth('2026-10', 'en', 'long')).toBe('October 2026');
    expect(formatMonth('2026-10', 'en', 'short')).toBe('Oct 2026');
  });
});

describe('formatIban', () => {
  it('groups by four characters', () => {
    expect(formatIban('DE94123456780000001234')).toBe('DE94 1234 5678 0000 0012 34');
  });
});
