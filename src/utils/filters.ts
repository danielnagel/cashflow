import { getTimeStampFromTransaction } from "src/utils/dates";

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
            return getTimeStampFromTransaction(transaction) >= sinceDate;
        })
        if (filteredTransactions.length === 0) return filteredTransactions;
    }


    if (typeof toDate !== "undefined") {
        filteredTransactions = filteredTransactions.filter((transaction) => {
            return getTimeStampFromTransaction(transaction) <= toDate;
        });
        if (filteredTransactions.length === 0) return filteredTransactions;
    }


    return filteredTransactions;
}