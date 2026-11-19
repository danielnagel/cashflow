/** Months as `YYYY-MM` strings. */

export function monthOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function addMonths(month: string, count: number): string {
  const [year = 0, number = 1] = month.split('-').map(Number);
  const index = year * 12 + (number - 1) + count;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
}

export type MonthWindow = { from: string; to: string; months: string[] };

/**
 * The months shown in the chart: `size` months ending `offset` months before the current one.
 * An offset of 0 shows the current month and the ones before it.
 */
export function monthWindow(current: string, offset: number, size: number): MonthWindow {
  const to = addMonths(current, -Math.max(0, offset));
  const months = Array.from({ length: size }, (_, i) => addMonths(to, i - size + 1));
  return { from: months[0] ?? to, to, months };
}
