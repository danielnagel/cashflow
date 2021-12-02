import { getTimeStampFromTransaction } from "./dates";

const compareTransactionsByDate = (transactionA: Transaction, transactionB: Transaction) => {
    const timeStampA = getTimeStampFromTransaction(transactionA);
    const timeStampB = getTimeStampFromTransaction(transactionB);
    if (timeStampA < timeStampB) return -1;
    if (timeStampA === timeStampB) return 0;
    return 1;
}

/**
 * Sort transactions by date, the referenced array will be sorted.
 * 
 * @param transactionA to compare
 * @param transactionB to compare
 */
export const sortTransactionsByDate = (transactions: Transaction[], descending = false): void => {
    transactions.sort(compareTransactionsByDate)
    if (descending) transactions.reverse();
}