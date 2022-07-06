import {
    generateReport,
    loadCategorizedTransactions,
} from "../../../interactor/interactor";
import { generateTrendReport } from "../../../interactor/report/trend";
import { isApplicationError } from "../../../utils/typeguards";
import { generateReportAsTable } from "../../../interactor/mutator/tabularize";
import { ReportType } from "../../../types/enums";

export const getTrend = async (
    options: Configuration,
    args: Arguments,
): Promise<TrendReport | ApplicationError> => {
    const transactions = await loadCategorizedTransactions(options);
    if (isApplicationError(transactions)) {
        return transactions;
    }

    return generateTrendReport(transactions, options, args);
};

export const getTrendSummary = async (
    options: Configuration,
    args: Arguments,
): Promise<ApplicationError | TrendReportTableRow[]> => {
    args.report = ReportType.Trend;
    args.trendType = undefined;

    const trendReport = await generateReport(options, args);
    if (isApplicationError(trendReport)) {
        return trendReport;
    }

    const table = generateReportAsTable(trendReport, options);
    if (isApplicationError(table)) {
        return table;
    }
    return table as TrendReportTableRow[];
};
