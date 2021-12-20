import { getTimeStampFromTransaction, parseDateString } from "./dates";

/**
 * Matches transactions after a given date.
 *
 * @param transactions that should be filtered
 * @param after date which is used to filter the list of transactions
 * @param dateFormat which is used to parse the date string
 * @returns matched transactions
 */
const transactionsAfterTimeStamp = (
    transactions: Transaction[],
    after: string | undefined,
    dateFormat: string | undefined,
): Transaction[] => {
    if (transactions.length === 0 || typeof after === "undefined")
        return transactions;
    const afterDate = parseDateString(after, dateFormat);
    if (afterDate === null) return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) > afterDate.getTime();
    });
};

/**
 * Matches transactions before a given date.
 *
 * @param transactions that should be filtered
 * @param before date which is used to filter the list of transactions
 * @param dateFormat which is used to parse the date string
 * @returns matched transactions
 */
const transactionsBeforeTimeStamp = (
    transactions: Transaction[],
    before: string | undefined,
    dateFormat: string | undefined,
): Transaction[] => {
    if (transactions.length === 0 || typeof before === "undefined")
        return transactions;
    const beforeDate = parseDateString(before, dateFormat);
    if (beforeDate === null) return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) < beforeDate.getTime();
    });
};

/**
 * Filters a list of transactions with given options.
 *
 * @param transactions list of transactions that should be filtered.
 * @param options to filter the list of transactions by.
 * @returns by given options filtered transactions.
 */
export const filterTransactions = (
    transactions: Transaction[],
    options: TransactionFilterOptions,
): Transaction[] => {
    let filteredTransactions: Transaction[] = [];
    for (const sample of options.samples) {
        for (const transaction of transactions) {
            if (isTransactionMatchingSample(transaction, sample)) {
                filteredTransactions.push(transaction);
            }
        }
    }

    filteredTransactions = transactionsBeforeTimeStamp(
        filteredTransactions,
        options.before,
        options.dateFormat,
    );
    filteredTransactions = transactionsAfterTimeStamp(
        filteredTransactions,
        options.after,
        options.dateFormat,
    );

    return filteredTransactions;
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
