import { createReadStream } from "fs";
import parse from "csv-parse/lib/index";
import {
    pathExists,
    isDirectory,
    isFile,
    loadFileNamesFromDirectory,
} from "../../utils/files";
import {
    decimalNumberToFloat,
    germanDecimalNumberToFloat,
} from "../../utils/numbers";
import { parseDateString } from "../../utils/dates";
import { isApplicationError } from "../../utils/typeguards";
import { log } from "../../utils/loggers";

/**
 * Generates a Transaction object from an unkown record.
 *
 * @param record UnknownRecord from a csv file
 * @param dataKeys DataKeys to use to match the unkown record
 * @param dateFormat which is used in the csv file
 * @returns Transaction object on succes
 * or an ApplicationError, when the record doesn't match given data keys,
 * the date in the record couldn't be parsed or the value in the record couldn't be parse.
 */
export const parseRecordToTransaction = (
    record: UnknownRecord,
    dataKeys: DataKeys,
    dateFormat: string,
): Transaction | ApplicationError => {
    const matchedRecord = matchDataKeysWithRecord(record, dataKeys);
    if (!matchedRecord) {
        return {
            source: "csv.ts",
            message: "Record doesn't match given data keys.",
        };
    }
    const date = parseDateString(matchedRecord.date, dateFormat);
    if (date === null)
        return {
            source: "csv.ts",
            message: `Couldn't parse date. Date string is "${matchedRecord.date}", date format is "${dateFormat}".`,
        };

    let parsedValue = germanDecimalNumberToFloat(matchedRecord.value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(matchedRecord.value);
        if (isNaN(parsedValue))
            return {
                source: "csv.ts",
                message: `Couldn't parse value. Value string is "${matchedRecord.value}".`,
            };
    }

    return {
        initiator: matchedRecord.initiator,
        purpose: matchedRecord.purpose,
        value: parsedValue,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    };
};

/**
 * Matches given DataKeys with an unkown record
 * and generates a MatchedRecord object on success.
 * The MatchedRecord is used to generate a Transaction object.
 *
 * @param record UnkownRecord
 * @param dataKeys DataKeys to use to match the unkown record
 * @returns MatchedRecord on success or null
 */
const matchDataKeysWithRecord = (
    record: UnknownRecord,
    dataKeys: DataKeys,
): MatchedRecord | null => {
    const date = record[dataKeys.date];
    if (typeof date === "undefined") return null;

    const initiator = record[dataKeys.initiator];
    if (typeof initiator === "undefined") return null;

    const purpose = record[dataKeys.purpose];
    if (typeof purpose === "undefined") return null;

    const value = record[dataKeys.value];
    if (typeof value === "undefined") return null;

    return { date, initiator, purpose, value };
};

/**
 * Loads transaction data from a csv file or multiple csv files in a directory.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @param loggerOptions (optional) to control logging behaviour
 * @returns a list of Transaction objects or an ApplcationError, when the given path doesn't exist.
 */
export const loadTransactionData = async (
    options: CsvOptions,
    loggerOptions?: LoggerOptions,
): Promise<Transaction[] | ApplicationError> => {
    if (!pathExists(options.path))
        return {
            source: "csv.ts",
            message: `CSV file with transaction data not found. Path: "${options.path}".`,
        };

    if (isFile(options.path)) {
        return await loadTransactionDataFromFile(options, loggerOptions);
    }

    return loadTransactionDataFromDirectory(options, loggerOptions);
};

/**
 * Loads the content of every csv file in a directory and merges it to a list of Transaction objects.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @param loggerOptions (optional) to control logging behaviour
 * @returns a list of Transaction objects
 */
const loadTransactionDataFromDirectory = async (
    options: CsvOptions,
    loggerOptions?: LoggerOptions,
): Promise<Transaction[]> => {
    const mergedTransactions: Transaction[] = [];
    if (isDirectory(options.path)) {
        const filesInDirectory = loadFileNamesFromDirectory(
            options.path,
            "csv",
        );
        for (const fileName of filesInDirectory) {
            if (options.path.endsWith("/"))
                options.path = options.path.slice(0, options.path.length - 1);
            const optionsCopy = { ...options };
            optionsCopy.path = `${options.path}/${fileName}`;
            const transactions = await loadTransactionDataFromFile(
                optionsCopy,
                loggerOptions,
            );
            mergedTransactions.push(
                ...filterDoubleTransactions(mergedTransactions, transactions),
            );
        }
    }
    return mergedTransactions;
};

/**
 * Loads the content of a csv file and merges it to a list of Transaction objects.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @param loggerOptions (optional) to control logging behaviour
 * @returns a list of Transaction objects
 */
const loadTransactionDataFromFile = async (
    options: CsvOptions,
    loggerOptions?: LoggerOptions,
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    if (typeof options.path !== "string") return transactions;

    const parser = createReadStream(options.path, { encoding: "latin1" }).pipe(
        parse({
            delimiter: ";",
            columns: options.columns,
            relaxColumnCount: true,
            skipEmptyLines: true,
        }),
    );

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(
            record,
            options.dataKeys,
            options.dateFormat,
        );
        if (isApplicationError(transaction)) {
            log({
                message: transaction,
                level: "debug",
                allowedLogLevel: loggerOptions?.allowedLogLevel,
                dateTimeFormat: loggerOptions?.dateTimeFormat,
            });
            continue;
        }
        transactions.push(transaction);
    }

    return transactions;
};

/**
 * Merges to lists of Transaction objects into one,
 * without double entries.
 *
 * @param transactions list of already loaded transactions
 * @param newTransactions list of newely loaded transactions
 * @returns list of transactions without double entries
 */
const filterDoubleTransactions = (
    transactions: Transaction[],
    newTransactions: Transaction[],
): Transaction[] => {
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
};

/**
 * Compares to Transcation objects.
 * @param transactionA Transaction object
 * @param transactionB Transaction object
 * @returns true if every attribute is the same, false otherwise.
 */
const isSameTransaction = (
    transactionA: Transaction,
    transactionB: Transaction,
): boolean => {
    return (
        transactionA.day === transactionB.day &&
        transactionA.month === transactionB.month &&
        transactionA.year === transactionB.year &&
        transactionA.initiator === transactionB.initiator &&
        transactionA.purpose === transactionB.purpose &&
        transactionA.value === transactionB.value
    );
};
