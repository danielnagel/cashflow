import { getTimeStampFromTransaction } from "src/utils/dates";

const transactionsAfterTimeStamp = (transactions: Transaction[], after: number | undefined): Transaction[] => {
    if (transactions.length === 0 || typeof after === "undefined") return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) > after;
    })
};

const transactionsBeforeTimeStamp = (transactions: Transaction[], before: number | undefined): Transaction[] => {
    if (transactions.length === 0 || typeof before === "undefined") return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) < before;
    })
};

/**
 * Filters a list of transactions with given options.
 * 
 * @param transactions list of transactions that should be filtered.
 * @param options to filter the list of transactions by.
 * @returns by given options filtered transactions.
 */
export const filterTransactions = (transactions: Transaction[], options: TransactionFilterOptions): Transaction[] => {
    let filteredTransactions: Transaction[] = [];
    for (const sample of options.samples) {
        for (const transaction of transactions) {
            if (transaction.initiator === sample) {
                filteredTransactions.push(transaction);
            }
        }
    }

    filteredTransactions = transactionsBeforeTimeStamp(filteredTransactions, options.before);
    filteredTransactions = transactionsAfterTimeStamp(filteredTransactions, options.after);

    return filteredTransactions;
}