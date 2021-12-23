import { loadTransactionData } from "./connector/csv";
import { isApplicationError } from "../utils/typeguards";
import { generateFixedPayDayReport } from "./report/fixedPaxDay";
import { ConnectorType, ReportType } from "../types/enums";
import {
    categorizeTransaction,
    getCategoryNamesFromCategorizeOptions,
} from "./mutator/categorize";
import { generateTrendReport } from "./report/trend";

/**
 * Generates a report using a connector.
 * Connector and report type are specified through user configuration.
 *
 * @param configuration
 * @returns Generated report when successful, otherwise an ApplicationError.
 * An ApplicationError is returned either on misconfiguration or when an error occures,
 * while loading the data or generating the report.
 */
export const generateReport = async (
    configuration: Configuration,
): Promise<Report | ApplicationError> => {
    let transactions: Transaction[] | ApplicationError = [];
    switch (configuration.interactor.connector.type) {
        case ConnectorType.CSV:
            transactions = await loadTransactionData(
                configuration.interactor.connector.options,
                configuration.logger,
            );
            if (isApplicationError(transactions)) return transactions;
            break;
        case ConnectorType.API:
        default:
            return {
                source: "interactor.ts",
                message: `Unkown connector type "${configuration.interactor.connector.type}".`,
            };
    }

    transactions = categorizeTransaction(
        transactions,
        configuration.interactor.mutator,
    );
    if (isApplicationError(transactions)) return transactions;

    switch (configuration.interactor.report.type) {
        case ReportType.FixedPayDay:
            const fixedPayDayReport = generateFixedPayDayReport(
                transactions,
                configuration.interactor.report.options,
                configuration.interactor.mutator,
                configuration.logger,
            );
            if (isApplicationError(fixedPayDayReport)) return fixedPayDayReport;
            return { type: "fixedpayday", report: fixedPayDayReport };
        case ReportType.Trend:
            const categories = getCategoryNamesFromCategorizeOptions(
                configuration.interactor.mutator,
            );
            if (isApplicationError(categories)) return categories;
            const trendReport = generateTrendReport(
                categories,
                transactions,
                configuration.interactor.report.options,
                configuration.logger,
            );
            if (isApplicationError(trendReport)) return trendReport;
            return { type: "trend", report: trendReport };
        default:
            return {
                source: "interactor.ts",
                message: `Unkown report type "${configuration.interactor.report.type}".`,
            };
    }
};
