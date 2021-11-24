import { filterTransactions } from "src/utils/filters";

export const generateFixCost = (transactions: Transaction[], samples: string[], toDate: number, sinceDate?: number): FixCost | null => {
    if(transactions.length === 0 || samples.length === 0 || typeof sinceDate !== "undefined" && sinceDate > toDate) return null;

    const matchedTransactions = filterTransactions(transactions, samples, toDate, sinceDate);
    if(matchedTransactions.length === 0) return null;

    // --- START SORTING TRANSACTIONS ---

    matchedTransactions.sort((transactionA, transactionB) => {
        const timeStampA = new Date(transactionA.year, transactionA.month, transactionA.day).getTime();
        const timeStampB = new Date(transactionB.year, transactionB.month, transactionB.day).getTime();
        if(timeStampA < timeStampB) return -1;
        if(timeStampA === timeStampB) return 0;
        return 1;
    })

    // --- END SORTING TRANSACTIONS ---

    // --- START ASSEMBLING PROCESS ---

    const result: FixCost = {value: 0, isPaidThisMonth: false, lastBookingDays: [], averageBookingDay: 0, transactions: []};

    result.value = matchedTransactions[matchedTransactions.length - 1].value;
    let month = new Date(toDate).getMonth();
    // december is 0
    if(month === 0) month = 12;

    for(const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if(matchedTransaction.month === month) result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(result.averageBookingDay / matchedTransactions.length);
    result.transactions = matchedTransactions;

    // --- END ASSEMBLING PROCESS ---

    return result;
}