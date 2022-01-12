import { addMonths, subDays, isBefore, isAfter } from "date-fns";
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
    options: Configuration,
): Transaction[] => {
    if (transactions.length === 0) return transactions;

    if (typeof options.endDate !== "undefined") {
        const beforeDate = parseDateString(options.endDate, options.dateFormat);
        if (beforeDate === null) return transactions;
        transactions = transactionsBeforeDate(transactions, beforeDate);
    }

    if (typeof options.startDate !== "undefined") {
        const afterDate = parseDateString(
            options.startDate,
            options.dateFormat,
        );
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
    if (isTransactionInitiatorMatchingSample(transaction, sample.initiator)) {
        if (typeof sample.purpose === "string" || sample.purpose === null) {
            return isTransactionPurposeMatchingSample(
                transaction,
                sample.purpose,
            );
        }
        return true;
    }
    // nothing matches
    return false;
};

const isTransactionInitiatorMatchingSample = (
    transaction: Transaction,
    initiator: string,
): boolean => {
    return (
        (initiator.startsWith("~") &&
            transaction.initiator
                .toLowerCase()
                .includes(initiator.substring(1).toLowerCase())) ||
        transaction.initiator === initiator
    );
};

const isTransactionPurposeMatchingSample = (
    transaction: Transaction,
    purpose: string | null,
): boolean => {
    if (purpose === null) return transaction.purpose.length === 0;
    return transaction.purpose.toLowerCase().includes(purpose.toLowerCase());
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

/**
 * Searches the oldest transaction date in a list of transactions.
 *
 * @param transactions to search through
 * @returns a javascript Date object of the oldest transaction
 * or null if an error occured
 */
export const getOldestTransactionDate = (
    transactions: Transaction[],
): Date | null => {
    if (transactions.length === 0) return null;
    let oldestDate = getDateFromTransaction(transactions[0]);
    for (let i = 1; i < transactions.length; i++) {
        const transactionDate = getDateFromTransaction(transactions[i]);
        if (isBefore(transactionDate, oldestDate)) oldestDate = transactionDate;
    }
    return oldestDate;
};

/**
 * Searches the latest transaction date in a list of transactions.
 *
 * @param transactions to search through
 * @returns a javascript Date object of the latest transaction
 * or null if an error occured
 */
export const getLatestTransactionDate = (
    transactions: Transaction[],
): Date | null => {
    if (transactions.length === 0) return null;
    let latestDate = getDateFromTransaction(transactions[0]);
    for (let i = 1; i < transactions.length; i++) {
        const transactionDate = getDateFromTransaction(transactions[i]);
        if (isAfter(transactionDate, latestDate)) latestDate = transactionDate;
    }
    return latestDate;
};
