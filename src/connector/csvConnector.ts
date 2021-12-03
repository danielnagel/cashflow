import { createReadStream } from "fs"
import parse from "csv-parse/lib/index";
import { fileExists } from "../utils/files";
import { decimalNumberToFloat, germanDecimalNumberToFloat } from "../utils/numbers";

export const parseRecordToTransaction = (record: UnknownRecord, dataKeys: DataKeys): Transaction | null => {
    const date = record[dataKeys.date];
    if (typeof date === "undefined") return null;

    const initiator = record[dataKeys.initiator];
    if (typeof initiator === "undefined") return null;

    const purpose = record[dataKeys.purpose];
    if (typeof purpose === "undefined") return null;

    const value = record[dataKeys.value];
    if (typeof value === "undefined") return null;

    const splitDate = date.split(".");
    if (splitDate.length !== 3) return null;

    const day = parseInt(splitDate[0]);
    const month = parseInt(splitDate[1]);
    const year = parseInt(splitDate[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    let parsedValue = germanDecimalNumberToFloat(value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(value);
        if (isNaN(parsedValue)) return null;
    }

    return { initiator, purpose, value: parsedValue, day, month, year };
}

export const loadTransactionData = async (options: CsvOptions): Promise<Transaction[]> => {
    const mergedTransactions: Transaction[] = [];

    if(typeof options.path === "string") {
        mergedTransactions.push(... await loadTransactionDataFromSingleFile(options.path, options.columns, options.dataKeys));
    } else if (Array.isArray(options.path) && options.path.length > 0) {
        for(const path of options.path) {
            const transactions = await loadTransactionDataFromSingleFile(path, options.columns, options.dataKeys)
            mergedTransactions.push(... filterDoubleTransactions(mergedTransactions, transactions));
        }
    }

    return mergedTransactions;
}

const loadTransactionDataFromSingleFile = async (path: string, columns: string[], dataKeys: DataKeys): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    if (!fileExists(path)) throw new Error(`CSV file with transaction data not found. Path: "${path}".`);

    const parser = createReadStream(path, { encoding: "latin1" }).pipe(parse({ delimiter: ";", columns: columns, relaxColumnCount: true, skipEmptyLines: true }));

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(record, dataKeys);
        if (!transaction) continue;
        transactions.push(transaction);
    }

    return transactions;
}

const filterDoubleTransactions = (transactions: Transaction[], newTransactions: Transaction[]): Transaction[] => {
    const filteredNewTransactions: Transaction[] = [];
    for(const newTransaction of newTransactions) {
        let isNewTransactionUnknown = true;
        for(const transaction of transactions) {
            if(isSameTransaction(newTransaction, transaction)) {
                isNewTransactionUnknown = false;
            }
        }
        if(isNewTransactionUnknown) {
            filteredNewTransactions.push(newTransaction);
        }
    }
    return filteredNewTransactions;
}

const isSameTransaction = (transactionA: Transaction, transactionB: Transaction) => {
    return transactionA.day === transactionB.day &&
    transactionA.month === transactionB.month &&
    transactionA.year === transactionB.year &&
    transactionA.initiator === transactionB.initiator &&
    transactionA.purpose === transactionB.purpose &&
    transactionA.value === transactionB.value;
}