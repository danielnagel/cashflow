export const getTimeStampFromTransaction = (transaction: Transaction): number => {
    return new Date(transaction.year, transaction.month, transaction.day).getTime();
}