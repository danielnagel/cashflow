import { loadTransactionData } from "./connector/csv";
import { isApplicationError } from "../utils/typeguards";
import { generateFixedPayDayReport } from "./report/fixedPayDay";
import { ConnectorType, ReportType } from "../types/enums";
import { categorizeTransaction } from "./mutator/categorize";
import { generateTrendReport } from "./report/trend";

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
): Promise<Report | ApplicationError> => {
    let transactions: Transaction[] | ApplicationError = [];
    switch (options.source.type) {
        case ConnectorType.CSV:
            transactions = await loadTransactionData(options);
            if (isApplicationError(transactions)) return transactions;
            break;
        case ConnectorType.API:
        default:
            return {
                source: "interactor.ts",
                message: `Unkown connector type "${options.source.type}".`,
            };
    }

    transactions = categorizeTransaction(transactions, options);
    if (isApplicationError(transactions)) return transactions;

    switch (options.report) {
        case ReportType.FixedPayDay:
            const fixedPayDayReport = generateFixedPayDayReport(
                transactions,
                options,
            );
            if (isApplicationError(fixedPayDayReport)) return fixedPayDayReport;
            return { type: "fixedpayday", report: fixedPayDayReport };
        case ReportType.Trend:
            const trendReport = generateTrendReport(transactions, options);
            if (isApplicationError(trendReport)) return trendReport;
            return { type: "trend", report: trendReport };
        default:
            return {
                source: "interactor.ts",
                message: `Unkown report type "${options.report}".`,
            };
    }
};
