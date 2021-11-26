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
    if (filterOptions.before) month = new Date(filterOptions.before).getMonth() + 1;

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if (matchedTransaction.month === month) result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(result.averageBookingDay / matchedTransactions.length);
    result.transactions = matchedTransactions;

    return result;
}

export const generateCategorizedFixCosts = (transactions: Transaction[], categorizeOptions: CategorizeOptions): CategorizedFixCosts | null => {
    if (transactions.length == 0 || categorizeOptions.categories.length === 0) return null;

    const namedFixCost: NamedFixCost[] = [];
    let sum = 0;
    let unpaidSum = 0;
    for (const category of categorizeOptions.categories) {
        const fixCost = generateFixCost(transactions, { samples: category.samples, before: categorizeOptions.before, after: categorizeOptions.after });
        if (!fixCost) continue;

        namedFixCost.push({ name: category.name, fixCost });
        sum += fixCost.value;
        if (!fixCost.isPaidThisMonth) unpaidSum += fixCost.value;
    }

    if (namedFixCost.length === 0) return null;

    const result: CategorizedFixCosts = {
        date: categorizeOptions.before ? categorizeOptions.before : new Date().getTime(),
        sum, unpaidSum, fixCosts: namedFixCost
    }

    return result;
}