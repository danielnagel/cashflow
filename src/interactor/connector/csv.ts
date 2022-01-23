import { createReadStream } from "fs";
import parse from "csv-parse/lib/index";
import {
    pathExists,
    isDirectory,
    isFile,
    loadFileNamesFromDirectory,
    createFilePath,
} from "../../utils/files";
import {
    decimalNumberToFloat,
    germanDecimalNumberToFloat,
} from "../../utils/numbers";
import { parseDateString } from "../../utils/dates";
import { isApplicationError } from "../../utils/typeguards";
import { log } from "../../utils/loggers";
import { filterDoubleTransactions } from "../../utils/filters";
import { ConnectorType, LogLevel } from "../../types/enums";

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
    dateFormat: string | undefined,
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
        date,
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
    options: CsvConfiguration,
): Promise<Transaction[] | ApplicationError> => {
    if (!pathExists(options.source.path))
        return {
            source: "csv.ts",
            message: `CSV file with transaction data not found. Path: "${options.source.path}".`,
        };

    if (isFile(options.source.path)) {
        if (!options.source.path.endsWith(".csv")) {
            return {
                source: "csv.ts",
                message: `Path needs to end with ".csv", path is "${options.source.path}"`,
            };
        }
        return await loadTransactionDataFromFile(options);
    }

    return loadTransactionDataFromDirectory(options);
};

/**
 * Loads the content of every csv file in a directory and merges it to a list of Transaction objects.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @param loggerOptions (optional) to control logging behaviour
 * @returns a list of Transaction objects
 */
const loadTransactionDataFromDirectory = async (
    options: CsvConfiguration,
): Promise<Transaction[]> => {
    let mergedTransactions: Transaction[] = [];
    if (isDirectory(options.source.path)) {
        const filesInDirectory = loadFileNamesFromDirectory(
            options.source.path,
            ConnectorType.CSV,
        );
        for (const fileName of filesInDirectory) {
            const optionsCopy = { ...options };
            optionsCopy.source = { ...options.source };
            const filePath = createFilePath(options.source.path, fileName);
            if (filePath !== null) {
                optionsCopy.source.path = filePath;
                const transactions = await loadTransactionDataFromFile(
                    optionsCopy,
                );
                mergedTransactions = filterDoubleTransactions(
                    mergedTransactions,
                    transactions,
                );
            }
        }
    }
    return mergedTransactions;
};

/**
 * Loads the content of a csv file and merges it to a list of Transaction objects.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @returns a list of Transaction objects
 */
const loadTransactionDataFromFile = async (
    options: CsvConfiguration,
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    const parser = createReadStream(options.source.path, {
        encoding: "latin1",
    }).pipe(
        parse({
            delimiter: ";",
            columns: options.source.columns,
            relaxColumnCount: true,
            skipEmptyLines: true,
        }),
    );

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(
            record,
            options.source.dataKeys,
            options.source.dateFormat,
        );
        if (isApplicationError(transaction)) {
            log({
                message: transaction,
                level: LogLevel.Debug,
                allowedLogLevel: options.allowedLogLevel,
                dateFormat: options.dateFormat,
                timeFormat: options.timeFormat,
                type: options.logType,
            });
            continue;
        }
        transactions.push(transaction);
    }
    return transactions;
};
