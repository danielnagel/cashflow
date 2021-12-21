import { getTimeStampFromTransaction, formatDate } from "../utils/dates";
import { round } from "../utils/numbers";

/**
 * Generates a given report as table.
 *
 * @param configuration made by the user
 * @param report which data should be generated as table data
 * @returns a list of FixCostsReportTableRow objects
 * or an ApplicationError when report is null or report type is unknown
 */
export const generateReportAsTable = (
    configuration: Configuration,
    report: Report,
): FixCostsReportTableRow[] | ApplicationError => {
    switch (report.type) {
        case "fixcost":
            if (!report.report) {
                return {
                    source: "viewer.ts",
                    message: "Cannot print Fixcosts report! Report is null.",
                };
            }
            return fixCostsReportAsTable(configuration, report.report);
        default:
            return {
                source: "viewer.ts",
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
const fixCostsReportAsTable = (
    configuration: Configuration,
    report: CategorizedFixedPayDays,
): FixCostsReportTableRow[] => {
    const tabularData: FixCostsReportTableRow[] = [];
    const dateFormat = configuration.viewer?.dateFormat
        ? configuration.viewer.dateFormat
        : "dd.MM.yyyy";
    const currency = configuration.viewer?.currency
        ? configuration.viewer.currency
        : "€$";
    for (const fixedPayDay of report.namedFixedPayDays) {
        const lastBookingDate = formatDate(
            new Date(
                getTimeStampFromTransaction(
                    fixedPayDay.fixedPayDay.transactions[
                        fixedPayDay.fixedPayDay.transactions.length - 1
                    ],
                ),
            ),
            dateFormat,
        );
        tabularData.push({
            category: fixedPayDay.name,
            paid: fixedPayDay.fixedPayDay.isPaidThisMonth,
            bookingDay: fixedPayDay.fixedPayDay.averageBookingDay,
            cost: `${round(fixedPayDay.fixedPayDay.value)} ${currency}`,
            lastBookingDate,
        });
    }
    tabularData.push({
        category: "Sum",
        paid: null,
        bookingDay: null,
        cost: `${round(-report.sum)} ${currency}`,
        lastBookingDate: null,
    });
    tabularData.push({
        category: "Unpaid",
        paid: null,
        bookingDay: null,
        cost: `${round(-report.unpaidSum)} ${currency}`,
        lastBookingDate: null,
    });
    return tabularData;
};
