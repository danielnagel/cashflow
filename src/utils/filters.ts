import { getTimeStampFromTransaction, parseDateString } from "./dates";

const transactionsAfterTimeStamp = (transactions: Transaction[], after: string | undefined, dateFormat: string | undefined): Transaction[] => {
    if (transactions.length === 0 || typeof after === "undefined") return transactions;
    const afterDate = parseDateString(after, dateFormat);
    if(afterDate === null) return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) > afterDate.getTime();
    })
};

const transactionsBeforeTimeStamp = (transactions: Transaction[], before: string | undefined, dateFormat: string | undefined): Transaction[] => {
    if (transactions.length === 0 || typeof before === "undefined") return transactions;
    const beforeDate = parseDateString(before, dateFormat);
    if(beforeDate === null) return transactions;

    return transactions.filter((transaction) => {
        return getTimeStampFromTransaction(transaction) < beforeDate.getTime();
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
            if (transaction.initiator === sample.initiator) {
                if(typeof sample.purpose === "string") {
                    if(transaction.purpose.toLowerCase().includes(sample.purpose.toLowerCase())) {
                        filteredTransactions.push(transaction);
                    }
                    continue;
                }
                filteredTransactions.push(transaction);
            }
        }
    }

    filteredTransactions = transactionsBeforeTimeStamp(filteredTransactions, options.before, options.dateFormat);
    filteredTransactions = transactionsAfterTimeStamp(filteredTransactions, options.after, options.dateFormat);

    return filteredTransactions;
}