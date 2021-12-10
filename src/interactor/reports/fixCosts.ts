import { formatDate, parseDateString } from "../../utils/dates";
import { filterTransactions } from "../../utils/filters";
import { sortTransactionsByDate } from "../../utils/sorters";
import { isApplicationError } from "../../utils/typeguards";

export const generateFixCost = (transactions: Transaction[], filterOptions: TransactionFilterOptions): FixCost | ApplicationError => {
    if (transactions.length === 0) return {source: "fixCosts.ts", message: "There are no transactions."};

    const matchedTransactions = filterTransactions(transactions, filterOptions);
    if (matchedTransactions.length === 0) return {source: "fixCosts.ts", message: "No transactions matched by filter."};

    sortTransactionsByDate(matchedTransactions);

    const result: FixCost = { value: 0, isPaidThisMonth: false, lastBookingDays: [], averageBookingDay: 0, transactions: [] };
    result.value = matchedTransactions[matchedTransactions.length - 1].value;

    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (filterOptions.before) {
        const beforeDate = parseDateString(filterOptions.before, filterOptions.dateFormat);
        if(!beforeDate) return {source: "fixCosts.ts", message: `Before date filter options can't be parse! Before date is '${beforeDate}'`};
        month = beforeDate.getMonth() + 1;
        year = beforeDate.getFullYear();
    }

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if (matchedTransaction.month === month && matchedTransaction.year === year) result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(result.averageBookingDay / matchedTransactions.length);
    result.transactions = matchedTransactions;

    return result;
}

export const generateCategorizedFixCosts = (transactions: Transaction[], categorizeOptions: CategorizeOptions): CategorizedFixCosts | ApplicationError => {
    if (transactions.length == 0) {
        return {source: "fixCosts.ts", message: "There are no transactions."};
    }

    if(categorizeOptions.categories.length === 0) {
        return {source: "fixCosts.ts", message: "There are no categories."};
    }

    const namedFixCost: NamedFixCost[] = [];
    let sum = 0;
    let unpaidSum = 0;
    for (const category of categorizeOptions.categories) {
        const fixCost = generateFixCost(transactions, { samples: category.samples, before: categorizeOptions.before, after: categorizeOptions.after });
        if (isApplicationError(fixCost)) {
            console.error(`[${fixCost.source}]: ${fixCost.message}`)
            continue;
        }

        namedFixCost.push({ name: category.name, fixCost });
        sum += fixCost.value;
        if (!fixCost.isPaidThisMonth) unpaidSum += fixCost.value;
    }

    if (namedFixCost.length === 0) return {source: "fixCosts.ts", message: "Couldn't match any categories."};

    let date = categorizeOptions.before ? categorizeOptions.before : formatDate(new Date());
    if (date === null) date = new Date().toLocaleDateString();
    const result: CategorizedFixCosts = {
        date,
        sum, unpaidSum, fixCosts: namedFixCost
    }

    return result;
}