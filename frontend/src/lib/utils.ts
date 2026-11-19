import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Right-aligned amount, coloured by sign. */
export function amountClass(amount: string) {
  return cn('text-right tabular-nums', Number(amount) < 0 ? 'text-expense' : 'text-income');
}
