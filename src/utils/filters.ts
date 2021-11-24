export const filterTransactions = (transactions: Transaction[], samples: string[], toDate?: number, sinceDate?: number): Transaction[] => {
    let filteredTransactions: Transaction[] = [];
    for (const sample of samples) {
        for (const transaction of transactions) {
            if (transaction.initiator === sample) {
                filteredTransactions.push(transaction);
            }
        }
    }

    if (typeof sinceDate !== "undefined") {
        filteredTransactions = filteredTransactions.filter((transaction) => {
            return new Date(transaction.year, transaction.month, transaction.day).getTime() >= sinceDate;
        })
        if (filteredTransactions.length === 0) return filteredTransactions;
    }


    if (typeof toDate !== "undefined") {
        filteredTransactions = filteredTransactions.filter((transaction) => {
            return new Date(transaction.year, transaction.month, transaction.day).getTime() <= toDate;
        });
        if (filteredTransactions.length === 0) return filteredTransactions;
    }


    return filteredTransactions;
}