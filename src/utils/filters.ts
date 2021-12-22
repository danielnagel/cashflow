import { addMonths, subDays } from "date-fns";
import { getDateFromTransaction, parseDateString } from "./dates";
import { isCategory } from "./typeguards";

/**
 * Matches transactions after a given date.
 *
 * @param transactions that should be filtered
 * @param after date which is used to filter the list of transactions
 * @returns matched transactions
 */
export const transactionsAfterDate = (
    transactions: Transaction[],
    after: Date,
): Transaction[] => {
    return transactions.filter((transaction) => {
        return getDateFromTransaction(transaction).getTime() > after.getTime();
    });
};

/**
 * Matches transactions before a given date.
 *
 * @param transactions that should be filtered
 * @param before date which is used to filter the list of transactions
 * @returns matched transactions
 */
export const transactionsBeforeDate = (
    transactions: Transaction[],
    before: Date,
): Transaction[] => {
    return transactions.filter((transaction) => {
        return getDateFromTransaction(transaction).getTime() < before.getTime();
    });
};

/**
 * Filters a list of transactions with given options.
 *
 * @param transactions list of transactions that should be filtered.
 * @param options to filter the list of transactions by.
 * @returns by given options filtered transactions.
 */
export const filterTransactionsByDateString = (
    transactions: Transaction[],
    options: FilterTransactionsByDateStringOptions,
): Transaction[] => {
    if (transactions.length === 0) return transactions;

    if (typeof options.before !== "undefined") {
        const beforeDate = parseDateString(options.before, options.dateFormat);
        if (beforeDate === null) return transactions;
        transactions = transactionsBeforeDate(transactions, beforeDate);
    }

    if (typeof options.after !== "undefined") {
        const afterDate = parseDateString(options.after, options.dateFormat);
        if (afterDate === null) return transactions;
        transactions = transactionsAfterDate(transactions, afterDate);
    }

    return transactions;
};

/**
 * Matches a transaction to a given sample.
 *
 * @param transaction
 * @param sample
 * @returns true if an initiator or also when defined a purpose was matching,
 * false otherwise
 */
export const isTransactionMatchingSample = (
    transaction: Transaction,
    sample: Sample,
): boolean => {
    if (transaction.initiator === sample.initiator) {
        if (typeof sample.purpose === "string") {
            if (
                transaction.purpose
                    .toLowerCase()
                    .includes(sample.purpose.toLowerCase())
            ) {
                // initiators and purpose matching
                return true;
            }
            // initiator matches, purpose exists, but doesn't match
            return false;
        }
        // initiators matching
        return true;
    }
    // nothing matches
    return false;
};

/**
 * Merges to lists of Transaction objects into one,
 * without double entries.
 *
 * @param transactionsA list of already loaded transactions
 * @param transactionsB list of newely loaded transactions
 * @returns list of transactions without double entries
 */
export const filterDoubleTransactions = (
    transactionsA: Transaction[],
    transactionsB: Transaction[],
): Transaction[] => {
    const transactions: Transaction[] = [...transactionsA];
    for (const transactionB of transactionsB) {
        let isTransactionUnknown = true;
        // TODO: fix filters
        for (const transactionA of transactionsA) {
            if (isSameTransaction(transactionA, transactionB)) {
                isTransactionUnknown = false;
                break;
            }
        }
        if (isTransactionUnknown) {
            transactions.push(transactionB);
        }
    }
    return transactions;
};

/**
 * Compares to Transcation objects.
 * @param transactionA Transaction object
 * @param transactionB Transaction object
 * @returns true if every attribute is the same, false otherwise.
 */
const isSameTransaction = (
    transactionA: Transaction,
    transactionB: Transaction,
): boolean => {
    return (
        transactionA.day === transactionB.day &&
        transactionA.month === transactionB.month &&
        transactionA.year === transactionB.year &&
        transactionA.initiator === transactionB.initiator &&
        transactionA.purpose === transactionB.purpose &&
        transactionA.value === transactionB.value
    );
};

/**
 * Filters a list of transactions by category type.
 *
 * @param transactions list of transactions that should be filtered.
 * @param options to filter the list of transactions by.
 * @returns by given options filtered transactions.
 */
export const filterTransactionsByCategoryType = (
    transactions: Transaction[],
    categoryType: string,
): Transaction[] => {
    const matchedTransactions: Transaction[] = [];
    for (const transaction of transactions) {
        if (
            isCategory(transaction.category) &&
            transaction.category.type === categoryType
        ) {
            matchedTransactions.push({ ...transaction });
        }
    }
    return matchedTransactions;
};

/**
 * Filters a list of transactions by category name.
 *
 * @param transactions list of transactions that should be filtered.
 * @param options to filter the list of transactions by.
 * @returns by given options filtered transactions.
 */
export const filterTransactionsByCategoryName = (
    transactions: Transaction[],
    categoryName: string,
): Transaction[] => {
    const matchedTransactions: Transaction[] = [];
    for (const transaction of transactions) {
        if (
            isCategory(transaction.category) &&
            transaction.category.name === categoryName
        ) {
            matchedTransactions.push({ ...transaction });
        }
    }
    return matchedTransactions;
};

/**
 * Filters a list of transactions with given options.
 *
 * @param transactions list of transactions that should be filtered.
 * @param period to filter the list of transactions by.
 * @param dateFormat that is used in the period string, default is yyyy.MM
 * @returns by given options filtered transactions.
 */
export const filterTransactionsByPeriod = (
    transactions: Transaction[],
    period: string,
    dateFormat = "yyyy.MM",
): Transaction[] => {
    let periodStart = parseDateString(period, dateFormat);
    if (periodStart === null) return [];

    const periodEnd = addMonths(periodStart, 1);
    periodStart = subDays(periodStart, 1);

    transactions = transactionsAfterDate(transactions, periodStart);
    transactions = transactionsBeforeDate(transactions, periodEnd);

    return transactions;
};
