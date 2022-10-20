import { createReadStream } from "fs";
import parse from "csv-parse/lib/index";
import {
    pathExists,
    isDirectory,
    isFile,
    loadFileNamesFromDirectory,
    createFilePath,
    loadFile,
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
    const date = parseDateString(matchedRecord.date, dateFormat);
    if (date === null)
        return {
            source: "csv.ts",
            message: `Couldn't parse record date. Date string is "${matchedRecord.date}", date format is "${dateFormat}".`,
        };

    let parsedValue = germanDecimalNumberToFloat(matchedRecord.value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(matchedRecord.value);
        if (isNaN(parsedValue))
            return {
                source: "csv.ts",
                message: `Couldn't parse record value. Value string is "${matchedRecord.value}".`,
            };
    }

    if (typeof matchedRecord.initiator === "undefined")
        return {
            source: "csv.ts",
            message: `Couldn't parse record initiator. Initiator is undefined.`,
        };

    if (typeof matchedRecord.purpose === "undefined")
        return {
            source: "csv.ts",
            message: `Couldn't parse record purpose. Purpose is undefined.`,
        };

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
): MatchedRecord => {
    const matchedRecord: MatchedRecord = {
        date: undefined,
        initiator: undefined,
        purpose: undefined,
        value: undefined,
    };
    matchedRecord.date = getRecordValue(record, dataKeys, "date");
    matchedRecord.initiator = getRecordValue(record, dataKeys, "initiator");
    matchedRecord.purpose = getRecordValue(record, dataKeys, "purpose");
    matchedRecord.value = getRecordValue(record, dataKeys, "value");
    return matchedRecord;
};

const getRecordValue = (
    record: UnknownRecord,
    dataKeys: DataKeys,
    key: string,
): string | undefined => {
    if (typeof dataKeys[key] === "undefined") return undefined;
    let value = undefined;
    if (dataKeys[key].startsWith("~")) {
        for (const [k, v] of Object.entries(record)) {
            if (k.includes(dataKeys[key].substring(1))) {
                return v;
            }
        }
    } else {
        return record[dataKeys[key]];
    }
    if (typeof value === "undefined") return undefined;
};

/**
 * Loads transaction data from a csv file or multiple csv files in a directory.
 *
 * @param options that specifies where to load the csv file from and how to handle its content.
 * @returns a list of Transaction objects or an ApplcationError, when the given path doesn't exist.
 */
export const loadTransactionData = async (
    options: CsvConfiguration,
    allowedLogLevel?: string,
    logType?: string,
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

    return loadTransactionDataFromDirectory(options, allowedLogLevel, logType);
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
    allowedLogLevel?: string,
    logType?: string,
): Promise<Transaction[] | ApplicationError> => {
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
                if (isApplicationError(transactions)) {
                    log({
                        message: transactions,
                        level: LogLevel.Error,
                        allowedLogLevel,
                        type: logType,
                    });
                    continue;
                }
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
): Promise<Transaction[] | ApplicationError> => {
    let { path, delimiter, dataKeys, dateFormat } = options.source;
    if (typeof delimiter === "undefined") delimiter = ";";

    const headLine = findHeadLineColumns(options);
    if (isApplicationError(headLine)) return headLine;
    const transactions: Transaction[] = [];
    const parser = createReadStream(path, {
        encoding: "latin1",
    }).pipe(
        parse({
            delimiter,
            columns: headLine,
            relaxColumnCount: true,
            skipEmptyLines: true,
        }),
    );

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(
            record,
            dataKeys,
            dateFormat,
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

const findHeadLineColumns = (
    options: CsvConfiguration,
): string[] | ApplicationError => {
    let { delimiter, minDelimiterCount, maxDelimiterCount, path } =
        options.source;
    if (typeof delimiter === "undefined") delimiter = ";";
    if (typeof minDelimiterCount === "undefined") minDelimiterCount = 5;
    if (typeof maxDelimiterCount === "undefined") maxDelimiterCount = 10;

    const file = loadFile(path);
    if (file === null || file.length === 0)
        return {
            source: "csv.ts",
            message: `File ${path.substring(
                path.lastIndexOf("/") + 1,
            )} does not exist.`,
        };

    const linesOfContent = file.split("\n");
    for (let i = 0; i < linesOfContent.length; i++) {
        const matches = (
            linesOfContent[i].match(new RegExp(delimiter, "g")) || []
        ).length;
        if (matches > minDelimiterCount && matches <= maxDelimiterCount) {
            return linesOfContent[i].split(delimiter);
        }
    }

    return {
        source: "csv.ts",
        message: `Delimiter "${delimiter}" was not found in File ${path.substring(
            path.lastIndexOf("/") + 1,
        )}.`,
    };
};
