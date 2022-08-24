import { loadTransactionData } from "./connector/csv";
import { isApplicationError, isCsvOptions } from "../utils/typeguards";
import { generateFixedPayDayReport } from "./report/fixedPayDay";
import { ConnectorType, ReportType } from "../types/enums";
import { categorizeTransaction } from "./mutator/categorize";
import { generateTrendReport } from "./report/trend";
import {
    getLatestTransactionId,
    loadDataJson,
    updateDataJson,
} from "./connector/data";
import {
    createDirectory,
    copyFile,
    loadFileNamesFromDirectory,
    createFilePath,
} from "../utils/files";
import { sortTransactionsByDate } from "../utils/sorters";

/**
 * Loads all extended transactions from  store.
 * If the store should not exist, e.g. the application is running for the first time,
 * all transactions will be loaded from specified source and categorized by given options.
 *
 * @param options user configuration
 * @returns Array of Transaction or an ApplicationError
 */
export const loadStoredExtendedTransactions = async (
    options: Configuration,
): Promise<ExtendedTransactionStore | ApplicationError> => {
    if (typeof options.storePath === "undefined") {
        options.storePath = "data/data.json"; // default path
    }

    const extendedTransactionStore = loadDataJson(options.storePath);
    const nextEntryId = getLatestTransactionId(extendedTransactionStore) + 1;

    const newExtendedTransactions = await loadCategorizedTransactions(
        options,
        nextEntryId,
    );
    if (isApplicationError(newExtendedTransactions)) {
        return newExtendedTransactions;
    }

    if (options.source.type === ConnectorType.CSV) {
        const source = options.source as CsvOptions;

        if (typeof source.backUpPath === "undefined") {
            source.backUpPath = "data/backup/"; // default
        }

        const filesInDirectory = loadFileNamesFromDirectory(
            source.path,
            ConnectorType.CSV,
        );

        createDirectory(source.backUpPath);
        for (const fileName of filesInDirectory) {
            const filePath = createFilePath(source.path, fileName);
            if (!filePath) continue;
            copyFile(filePath, source.backUpPath, true);
        }
    }

    const newExtendedTransactionStore = updateDataJson(
        options.storePath,
        newExtendedTransactions,
    );
    if (isApplicationError(newExtendedTransactionStore)) {
        return newExtendedTransactionStore;
    }

    return newExtendedTransactionStore;
};

/**
 * Loads all transactions from specified source and categorizes them by given options.
 *
 * @param options user configuration
 * @returns Array of Transaction or an ApplicationError
 */
export const loadCategorizedTransactions = async (
    options: Configuration,
    id?: number,
): Promise<ExtendedTransaction[] | ApplicationError> => {
    // when not load from csv files
    // also store which files where already loaded and stored in store
    let transactions: Transaction[] | ApplicationError = [];
    switch (options.source.type) {
        case ConnectorType.CSV:
            if (!isCsvOptions(options.source)) {
                return {
                    source: "interactor.ts",
                    message: `Malformed source configuration for CSV type.`,
                };
            }
            transactions = await loadTransactionData(
                options as CsvConfiguration,
            );
            if (isApplicationError(transactions)) return transactions;
            break;
        default:
            return {
                source: "interactor.ts",
                message: `Unkown connector type "${options.source.type}".`,
            };
    }

    return categorizeTransaction(transactions, options, id);
};

/**
 * Generates a report using a connector.
 * Connector and report type are specified through user configuration.
 *
 * @param options
 * @returns Generated report when successful, otherwise an ApplicationError.
 * An ApplicationError is returned either on misconfiguration or when an error occures,
 * while loading the data or generating the report.
 */
export const generateReport = async (
    options: Configuration,
    args: Arguments,
): Promise<Report | ApplicationError> => {
    const extendedTransactionStore = await loadStoredExtendedTransactions(
        options,
    );
    if (extendedTransactionStore === null) {
        return {
            source: "interactor.ts",
            message: "Failed loading extended transactions store.",
        };
    }
    if (isApplicationError(extendedTransactionStore)) {
        return extendedTransactionStore;
    }
    const transactions = extendedTransactionStore.extendedTransactions;
    if (isApplicationError(transactions)) return transactions;

    switch (args.report) {
        case ReportType.FixedPayDay:
            const fixedPayDayReport = generateFixedPayDayReport(
                transactions,
                options,
            );
            if (isApplicationError(fixedPayDayReport)) return fixedPayDayReport;
            return { type: "fixedpayday", ...fixedPayDayReport };
        case ReportType.Trend:
            const trendReport = generateTrendReport(
                transactions,
                options,
                args,
            );
            if (isApplicationError(trendReport)) return trendReport;
            return { type: "trend", ...trendReport };
        case ReportType.Transactions:
            sortTransactionsByDate(transactions, true);
            return { type: "transactions", transactions };
        default:
            return {
                source: "interactor.ts",
                message: `Unkown report type "${args.report}".`,
            };
    }
};
