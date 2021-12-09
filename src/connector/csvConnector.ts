import { createReadStream } from "fs"
import parse from "csv-parse/lib/index";
import { fileExists, isFile, loadFileNamesFromDirectory } from "../utils/files";
import { decimalNumberToFloat, germanDecimalNumberToFloat } from "../utils/numbers";
import { parseDateString } from "../utils/dates";

export const parseRecordToTransaction = (record: UnknownRecord, dataKeys: DataKeys, dateFormat: string): Transaction | null => {
    const dateString = record[dataKeys.date];
    if (typeof dateString === "undefined") return null;

    const initiator = record[dataKeys.initiator];
    if (typeof initiator === "undefined") return null;

    const purpose = record[dataKeys.purpose];
    if (typeof purpose === "undefined") return null;

    const value = record[dataKeys.value];
    if (typeof value === "undefined") return null;

    const date = parseDateString(dateString, dateFormat);
    if (date === null) return null;

    let parsedValue = germanDecimalNumberToFloat(value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(value);
        if (isNaN(parsedValue)) return null;
    }

    return { initiator, purpose, value: parsedValue, day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
}

export const loadTransactionData = async (options: CsvOptions): Promise<Transaction[]> => {
    const mergedTransactions: Transaction[] = [];


    if (typeof options.path === "string") {
        if (!fileExists(options.path)) throw new Error(`CSV file with transaction data not found. Path: "${options.path}".`);
        if (isFile(options.path)) {
            mergedTransactions.push(... await loadTransactionDataFromSingleFile(options));
        } else {
            const filesInDirectory = loadFileNamesFromDirectory(options.path, "csv");
            for (const fileName of filesInDirectory) {
                if (options.path.endsWith("/")) options.path = options.path.slice(0, options.path.length - 1);
                const optionsCopy = { ...options };
                optionsCopy.path = `${options.path}/${fileName}`;
                const transactions = await loadTransactionDataFromSingleFile(optionsCopy);
                mergedTransactions.push(...filterDoubleTransactions(mergedTransactions, transactions));
            }
        }
    } else if (Array.isArray(options.path) && options.path.length > 0) {
        for (const path of options.path) {
            if (!fileExists(path)) throw new Error(`CSV file with transaction data not found. Path: "${options.path}".`);
            const optionsCopy = { ...options };
            optionsCopy.path = path;
            const transactions = await loadTransactionDataFromSingleFile(optionsCopy);
            mergedTransactions.push(...filterDoubleTransactions(mergedTransactions, transactions));
        }
    }

    return mergedTransactions;
}

const loadTransactionDataFromSingleFile = async (options: CsvOptions): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    
    if(typeof options.path !== "string") return transactions;

    const parser = createReadStream(options.path, { encoding: "latin1" }).pipe(parse({ delimiter: ";", columns: options.columns, relaxColumnCount: true, skipEmptyLines: true }));

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(record, options.dataKeys, options.dateFormat);
        if (!transaction) continue;
        transactions.push(transaction);
    }

    return transactions;
}

const filterDoubleTransactions = (transactions: Transaction[], newTransactions: Transaction[]): Transaction[] => {
    const filteredNewTransactions: Transaction[] = [];
    for (const newTransaction of newTransactions) {
        let isNewTransactionUnknown = true;
        for (const transaction of transactions) {
            if (isSameTransaction(newTransaction, transaction)) {
                isNewTransactionUnknown = false;
            }
        }
        if (isNewTransactionUnknown) {
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