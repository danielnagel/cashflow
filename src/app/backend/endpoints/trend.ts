import { generateReport } from "../../../interactor/interactor";
import { isApplicationError } from "../../../utils/typeguards";
import { generateReportAsTable } from "../../../interactor/mutator/tabularize";
import { ReportType } from "../../../types/enums";

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
