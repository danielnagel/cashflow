import { getTimeStampFromTransaction } from "./dates";

/**
 * Compares two transactions by time stamp.
 *
 * @param transactionA
 * @param transactionB
 * @returns -1 when time stamp of transactionA is greater than from transactionB
 * 0 when both time stamps are equal, 1 otherwise
 */
const compareTransactionsByDate = (
    transactionA: Transaction,
    transactionB: Transaction,
) => {
    const timeStampA = getTimeStampFromTransaction(transactionA);
    const timeStampB = getTimeStampFromTransaction(transactionB);
    if (timeStampA < timeStampB) return -1;
    if (timeStampA === timeStampB) return 0;
    return 1;
};

/**
 * Sort transactions by date, the referenced array will be sorted.
 *
 * @param transactionA to compare
 * @param transactionB to compare
 */
export const sortTransactionsByDate = (
    transactions: Transaction[],
    descending = false,
): void => {
    transactions.sort(compareTransactionsByDate);
    if (descending) transactions.reverse();
};
