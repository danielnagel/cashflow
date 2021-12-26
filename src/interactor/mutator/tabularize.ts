import { ReportType } from "../../types/enums";
import { getDateFromTransaction, formatDate } from "../../utils/dates";
import { roundToString } from "../../utils/numbers";

/**
 * Generates a given report as table.
 *
 * @param configuration made by the user
 * @param report which data should be generated as table data
 * @returns a list of FixCostsReportTableRow objects
 * or an ApplicationError when report is null or report type is unknown
 */
export const generateReportAsTable = (
    report: Report,
    options?: ConsoleViewerOptions,
): FixCostsReportTableRow[] | ApplicationError => {
    switch (report.type) {
        case ReportType.FixedPayDay:
            if (!report.report) {
                return {
                    source: "tabularize.ts",
                    message: `Cannot print ${report.type} report! Report is null.`,
                };
            }
            return fixedPayDayReportAsTable(report.report, options);
        case ReportType.Trend:
            if (!report.report) {
                return {
                    source: "tabularize.ts",
                    message: `Cannot print ${report.type} report! Report is null.`,
                };
            }
            return trendReportAsTable(report.report, options);
        default:
            return {
                source: "tabularize.ts",
                message: `Unkown report type: ${report.type}!`,
            };
    }
};

/**
 * Generates a fix costs report as table.
 *
 * @param configuration made by the user
 * @param report FixCosts report which should be generated as table data
 * @returns a list of FixCostsReportTableRow objects
 */
const fixedPayDayReportAsTable = (
    report: CategorizedFixedPayDays,
    options?: ConsoleViewerOptions,
): FixCostsReportTableRow[] => {
    const tabularData: FixCostsReportTableRow[] = [];
    const dateFormat = options?.dateFormat ? options.dateFormat : "dd.MM.yyyy";
    const currency = options?.currency ? options.currency : "€$";
    for (const fixedPayDay of report.namedFixedPayDays) {
        const lastBookingDate = formatDate(
            getDateFromTransaction(
                fixedPayDay.fixedPayDay.transactions[
                    fixedPayDay.fixedPayDay.transactions.length - 1
                ],
            ),
            dateFormat,
        );
        tabularData.push({
            category: fixedPayDay.name,
            paid: fixedPayDay.fixedPayDay.isPaid,
            bookingDay: fixedPayDay.fixedPayDay.averageBookingDay,
            cost: `${roundToString(fixedPayDay.fixedPayDay.value)} ${currency}`,
            lastBookingDate,
        });
    }
    tabularData.push({
        category: "Sum",
        paid: null,
        bookingDay: null,
        cost: `${roundToString(-report.sum)} ${currency}`,
        lastBookingDate: null,
    });
    tabularData.push({
        category: "Unpaid",
        paid: null,
        bookingDay: null,
        cost: `${roundToString(-report.unpaidSum)} ${currency}`,
        lastBookingDate: null,
    });
    return tabularData;
};

const trendReportAsTable = (
    report: TrendReport,
    configuration?: ConsoleViewerOptions,
): ApplicationError => {
    return {
        source: "tabularize.ts",
        message: "trendReportAsTable is unimplemented!",
    };
};
