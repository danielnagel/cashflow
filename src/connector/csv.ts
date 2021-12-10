import { createReadStream } from "fs"
import parse from "csv-parse/lib/index";
import { fileExists, isFile, loadFileNamesFromDirectory } from "../utils/files";
import { decimalNumberToFloat, germanDecimalNumberToFloat } from "../utils/numbers";
import { parseDateString } from "../utils/dates";
import { isApplicationError } from "../utils/typeguards";
import { logToConsole } from "../utils/logger";

export const parseRecordToTransaction = (record: UnknownRecord, dataKeys: DataKeys, dateFormat: string): Transaction | ApplicationError => {
    const matchedRecord = matchDataKeysWithRecord(record, dataKeys);
    if (!matchedRecord) {
        return { source: "csv.ts", message: "Record doesn't match given data keys." };
    }
    const date = parseDateString(matchedRecord.date, dateFormat);
    if (date === null) return { source: "csv.ts", message: `Couldn't parse date. Date string is "${matchedRecord.date}", date format is "${dateFormat}".` };

    let parsedValue = germanDecimalNumberToFloat(matchedRecord.value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(matchedRecord.value);
        if (isNaN(parsedValue)) return { source: "csv.ts", message: `Couldn't parse value. Value string is "${matchedRecord.value}".` };
    }

    return { initiator: matchedRecord.initiator, purpose: matchedRecord.purpose, value: parsedValue, day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
}

const matchDataKeysWithRecord = (record: UnknownRecord, dataKeys: DataKeys): MatchedRecord | null => {
    const date = record[dataKeys.date];
    if (typeof date === "undefined") return null;

    const initiator = record[dataKeys.initiator];
    if (typeof initiator === "undefined") return null;

    const purpose = record[dataKeys.purpose];
    if (typeof purpose === "undefined") return null;

    const value = record[dataKeys.value];
    if (typeof value === "undefined") return null;

    return { date, initiator, purpose, value };
}

export const loadTransactionData = async (options: CsvOptions, loggerOptions?: LoggerOptions): Promise<Transaction[] | ApplicationError> => {
    const mergedTransactions: Transaction[] = [];


    if (typeof options.path === "string") {
        if (!fileExists(options.path)) return { source: "csv.ts", message: `CSV file with transaction data not found. Path: "${options.path}".` };
        if (isFile(options.path)) {
            mergedTransactions.push(... await loadTransactionDataFromSingleFile(options, loggerOptions));
        } else {
            const filesInDirectory = loadFileNamesFromDirectory(options.path, "csv");
            for (const fileName of filesInDirectory) {
                if (options.path.endsWith("/")) options.path = options.path.slice(0, options.path.length - 1);
                const optionsCopy = { ...options };
                optionsCopy.path = `${options.path}/${fileName}`;
                const transactions = await loadTransactionDataFromSingleFile(optionsCopy, loggerOptions);
                mergedTransactions.push(...filterDoubleTransactions(mergedTransactions, transactions));
            }
        }
    } else if (Array.isArray(options.path) && options.path.length > 0) {
        for (const path of options.path) {
            if (!fileExists(path)) return { source: "csv.ts", message: `CSV file with transaction data not found. Path: "${options.path}".` };
            const optionsCopy = { ...options };
            optionsCopy.path = path;
            const transactions = await loadTransactionDataFromSingleFile(optionsCopy, loggerOptions);
            mergedTransactions.push(...filterDoubleTransactions(mergedTransactions, transactions));
        }
    }

    return mergedTransactions;
}

const loadTransactionDataFromSingleFile = async (options: CsvOptions, loggerOptions?: LoggerOptions): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    if (typeof options.path !== "string") return transactions;

    const parser = createReadStream(options.path, { encoding: "latin1" }).pipe(parse({ delimiter: ";", columns: options.columns, relaxColumnCount: true, skipEmptyLines: true }));

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(record, options.dataKeys, options.dateFormat);
        if (isApplicationError(transaction)) {
            logToConsole({ message: transaction, level: "debug", allowedLogLevel: loggerOptions?.allowedLogLevel, dateTimeFormat: loggerOptions?.dateTimeFormat });
            continue;
        }
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