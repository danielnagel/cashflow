import { generateReport } from "../../interactor/interactor";
import { isApplicationError } from "../../utils/typeguards";
import { ReportType } from "../../types/enums";
import { generateReportAsTable } from "../../interactor/mutator/tabularize";

export const getFixedPayDay = async (
    options: Configuration,
    args: Arguments,
): Promise<CategorizedFixedPayDays | ApplicationError> => {
    args.report = ReportType.FixedPayDay;
    const report = await generateReport(options, args);
    if (isApplicationError(report)) {
        return report;
    }
    return report as CategorizedFixedPayDays;
};

export const getAllTransactions = async (
    options: Configuration,
    args: Arguments,
): Promise<ReportTransactions | ApplicationError> => {
    args.report = ReportType.Transactions;
    const report = await generateReport(options, args);
    if (isApplicationError(report)) {
        return report;
    }
    return report as ReportTransactions;
};

export const getTrendReportTable = async (
    options: Configuration,
    args: Arguments,
): Promise<ApplicationError | TrendReportTableRow[]> => {
    args.report = ReportType.Trend;
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
