import { filterTransactions } from "src/utils/filters";
import { sortTransactionsByDate } from "src/utils/sorters";

export const generateFixCost = (transactions: Transaction[], samples: string[], toDate: number, sinceDate?: number): FixCost | null => {
    if (transactions.length === 0 || samples.length === 0 || typeof sinceDate !== "undefined" && sinceDate > toDate) return null;

    const matchedTransactions = filterTransactions(transactions, samples, toDate, sinceDate);
    if (matchedTransactions.length === 0) return null;

    sortTransactionsByDate(matchedTransactions);

    const result: FixCost = { value: 0, isPaidThisMonth: false, lastBookingDays: [], averageBookingDay: 0, transactions: [] };
    result.value = matchedTransactions[matchedTransactions.length - 1].value;

    let month = new Date(toDate).getMonth();
    // december is 0
    if (month === 0) month = 12;

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if (matchedTransaction.month === month) result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(result.averageBookingDay / matchedTransactions.length);
    result.transactions = matchedTransactions;

    return result;
}