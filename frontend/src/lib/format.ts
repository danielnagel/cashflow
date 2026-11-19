import { useTranslation } from 'react-i18next';

/** Parses `YYYY-MM-DD` as a local calendar day, without a time zone shift. */
export function parseDay(day: string): Date {
  const [year = 0, month = 1, date = 1] = day.split('-').map(Number);
  return new Date(year, month - 1, date);
}

export function formatAmount(value: string | number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(
    Number(value),
  );
}

/** Whole euros with an explicit sign, e.g. for the difference in the chart. */
export function formatDifference(value: string | number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    signDisplay: 'exceptZero',
  }).format(Number(value));
}

export function formatDate(day: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parseDay(day));
}

export function formatDateTime(timestamp: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(timestamp),
  );
}

export function formatMonth(month: string, locale: string, style: 'short' | 'long'): string {
  return new Intl.DateTimeFormat(locale, { month: style, year: 'numeric' }).format(
    parseDay(`${month}-01`),
  );
}

export function formatIban(iban: string): string {
  return iban.replace(/\s/g, '').replace(/(.{4})(?=.)/g, '$1 ');
}

/** The formatters bound to the active language. */
export function useFormat() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  return {
    amount: (value: string | number) => formatAmount(value, locale),
    difference: (value: string | number) => formatDifference(value, locale),
    date: (day: string) => formatDate(day, locale),
    dateTime: (timestamp: string) => formatDateTime(timestamp, locale),
    month: (month: string, style: 'short' | 'long' = 'long') => formatMonth(month, locale, style),
  };
}
