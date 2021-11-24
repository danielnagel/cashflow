import { filterTransactions } from "src/utils/filters";
import { sortTransactionsByDate } from "src/utils/sorters";

export const generateFixCost = (transactions: Transaction[], filterOptions: TransactionFilterOptions): FixCost | null => {
    if (transactions.length === 0) return null;

    const matchedTransactions = filterTransactions(transactions, filterOptions);
    if (matchedTransactions.length === 0) return null;

    sortTransactionsByDate(matchedTransactions);

    const mostRecentTransaction = matchedTransactions[matchedTransactions.length - 1];
    const result: FixCost = { value: 0, isPaidThisMonth: false, lastBookingDays: [], averageBookingDay: 0, transactions: [] };
    result.value = mostRecentTransaction.value;

    let month = mostRecentTransaction.month;
    if(filterOptions.before) month = new Date(filterOptions.before).getMonth() + 1;

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if (matchedTransaction.month === month) result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(result.averageBookingDay / matchedTransactions.length);
    result.transactions = matchedTransactions;

    return result;
}