import { loadTransactionData } from "./connector/csv";
import { isApplicationError, isCsvOptions } from "../utils/typeguards";
import { generateFixedPayDayReport } from "./report/fixedPayDay";
import { ConnectorType, ReportType } from "../types/enums";
import { categorizeTransaction } from "./mutator/categorize";
import { generateTrendReport } from "./report/trend";

/**
 * Loads all transactions from specified source and categorizes them by given options.
 *
 * @param options user configuration
 * @returns Array of Transaction or an ApplicationError
 */
export const loadCategorizedTransactions = async (
    options: Configuration,
): Promise<ExtendedTransaction[] | ApplicationError> => {
    // TODO: check if data in store

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

    // TODO: store categorized transactions to use later
    // store remembers id of latest storage
    return categorizeTransaction(transactions, options);
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
    const transactions = await loadCategorizedTransactions(options);
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
        default:
            return {
                source: "interactor.ts",
                message: `Unkown report type "${args.report}".`,
            };
    }
};
