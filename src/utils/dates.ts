export const getTimeStampFromTransaction = (transaction: Transaction): number => {
    return new Date(transaction.year, transaction.month - 1, transaction.day).getTime();
}