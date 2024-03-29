import { isBefore, addMonths } from "date-fns";
import { ReportType, TransactionType } from "../../types/enums";
import { formatDate, parseDateString } from "../../utils/dates";
import { roundToString } from "../../utils/numbers";
import {
    isFixedCategoryTrendPeriod,
    isReportFixedPayDay,
    isReportTrend,
    isVariableCategoryTrendPeriod,
} from "../../utils/typeguards";

/**
 * Generates a given report as table.
 *
 * @param configuration made by the user
 * @param report which data should be generated as table data
 * @returns a list of FixedPayDayReportTableRow objects
 * or an ApplicationError when report is null or report type is unknown
 */
export const generateReportAsTable = (
    report: Report,
    options?: Configuration,
): FixedPayDayReportTableRow[] | TrendReportTableRow[] | ApplicationError => {
    switch (report.type) {
        case ReportType.FixedPayDay:
            if (!isReportFixedPayDay(report)) {
                return {
                    source: "tabularize.ts",
                    message: `Cannot print ${report.type} report! Report has wrong format.`,
                };
            }
            return fixedPayDayReportAsTable(report, options);
        case ReportType.Trend:
            if (!isReportTrend(report)) {
                return {
                    source: "tabularize.ts",
                    message: `Cannot print ${report.type} report! Report has wrong format.`,
                };
            }
            return trendReportAsTable(report, options);
        default:
            return {
                source: "tabularize.ts",
                message: `Unkown report type: ${report.type}!`,
            };
    }
};

/**
 * Generates a fixed pay day report as table.
 *
 * @param report FixedPayday report which should be generated as table data
 * @param options (optional) to format the output
 * @returns a list of FixedPayDayReportTableRow objects
 */
const fixedPayDayReportAsTable = (
    report: CategorizedFixedPayDays,
    options?: Configuration,
): FixedPayDayReportTableRow[] => {
    const tabularData: FixedPayDayReportTableRow[] = [];
    const dateFormat = options?.dateFormat ? options.dateFormat : "dd.MM.yyyy";
    const currency = options?.currency ? options.currency : "€$";
    for (const fixedPayDay of report.namedFixedPayDays) {
        const lastTransaction =
            fixedPayDay.fixedPayDay.transactions[
                fixedPayDay.fixedPayDay.transactions.length - 1
            ];
        const lastBookingDate = formatDate(lastTransaction.date, dateFormat);
        let period = null;
        if (
            typeof lastTransaction.category !== "undefined" &&
            typeof lastTransaction.category.period === "string"
        ) {
            period = lastTransaction.category.period;
        }
        tabularData.push({
            category: fixedPayDay.name,
            paid: fixedPayDay.fixedPayDay.isPaid,
            cost: `${roundToString(fixedPayDay.fixedPayDay.value)} ${currency}`,
            lastBookingDate,
            period,
        });
    }
    tabularData.push({
        category: "Sum",
        paid: null,
        cost: `${roundToString(-report.sum)} ${currency}`,
        lastBookingDate: null,
        period: null,
    });
    tabularData.push({
        category: "Unpaid",
        paid: null,
        cost: `${roundToString(-report.unpaidSum)} ${currency}`,
        lastBookingDate: null,
        period: null,
    });
    return tabularData;
};

/**
 * Generates a trend report as table.
 *
 * @param report Trend report which should be generated as table data
 * @param options (optional) to format the output
 * @returns a list of TrendReportTableRow objects
 */
const trendReportAsTable = (
    report: TrendReport,
    options?: Configuration,
): TrendReportTableRow[] => {
    const tabularData: TrendReportTableRow[] = [];
    const startPeriod = getStartPeriod(report, options);
    const endPeriod = getEndPeriod(options);
    const currency =
        typeof options !== "undefined" && typeof options.currency === "string"
            ? options.currency
            : "€$";
    for (const trend of report.trends) {
        if (typeof report.trendType === "undefined") {
            tabularData.push(
                generateTrendReportSummaryRow(
                    trend,
                    startPeriod,
                    endPeriod,
                    currency,
                ),
            );
        } else {
            for (const category of trend.categories) {
                tabularData.push(
                    generateTrendReportCategoryRow(
                        trend,
                        category,
                        startPeriod,
                        endPeriod,
                        currency,
                    ),
                );
            }
        }
    }
    return tabularData;
};

/**
 * Gets the first period in a trend report.
 *
 * @param report Trend report which should be generated as table data
 * @param options (optional) to format the output
 * @returns the first period as a javascript Date object
 */
const getStartPeriod = (report: TrendReport, options?: Configuration): Date => {
    let startPeriod = getEndPeriod(options);
    for (const trend of report.trends) {
        for (const category of trend.categories) {
            const period = parseDateString(
                category.periods[0].period,
                "yyyy.MM",
            );
            if (period !== null && isBefore(period, startPeriod)) {
                startPeriod = period;
            }
        }
    }
    return startPeriod;
};

/**
 * Gets the end period for a trend report,
 * which is either the current date or the before option,
 * formatted as a date.
 *
 * @param options (optional) to format the output
 * @returns the end period as a javascript Date object
 */
const getEndPeriod = (options?: Configuration) => {
    let endPeriod = new Date();
    if (typeof options !== "undefined" && typeof options.endDate === "string") {
        const dateFormat =
            typeof options.dateFormat === "string"
                ? options.dateFormat
                : "dd.MM.yyyy";
        const before = parseDateString(options.endDate, dateFormat);
        if (before !== null) endPeriod = before;
    }
    return endPeriod;
};

/**
 * Generates a row for a trend report summary.
 * A trend report summary wasn't generated for one explicit transaction type.
 *
 * @param trend Trend object from a trend report.
 * @param startPeriod Which is used to begin the periods.
 * @param endPeriod  Which is used as the last period.
 * @param currency Output format.
 * @returns A TrendReportTableRow object
 */
const generateTrendReportSummaryRow = (
    trend: Trend,
    startPeriod: Date,
    endPeriod: Date,
    currency: string,
): TrendReportTableRow => {
    const row: TrendReportTableRow = {
        category: trend.type,
    };
    let temporaryStartPeriod = startPeriod;
    while (isBefore(temporaryStartPeriod, endPeriod)) {
        const startPeriodString = formatDate(temporaryStartPeriod, "yyyy.MM");
        if (startPeriodString !== null) {
            let value: number = 0;
            for (const category of trend.categories) {
                for (const period of category.periods) {
                    if (period.period === startPeriodString) {
                        if (isFixedCategoryTrendPeriod(period)) {
                            value += period.value;
                        }
                        if (isVariableCategoryTrendPeriod(period)) {
                            value += period.sum;
                        }
                    }
                }
            }

            row[startPeriodString] = `${roundToString(value)} ${currency}`;
            temporaryStartPeriod = addMonths(temporaryStartPeriod, 1);
        }
    }
    return row;
};

/**
 * Generates a row for a trend report category.
 * The category rows are generated,
 * when a trend was explicitly generated for one transaction type.
 *
 * @param trend Trend object from a trend report.
 * @param category Category object from a trend.
 * @param startPeriod Which is used to begin the periods.
 * @param endPeriod  Which is used as the last period.
 * @param currency Output format.
 * @returns A TrendReportTableRow object
 */
const generateTrendReportCategoryRow = (
    trend: Trend,
    category: CategoryTrend,
    startPeriod: Date,
    endPeriod: Date,
    currency: string,
): TrendReportTableRow => {
    const row: TrendReportTableRow = {
        category: category.name,
    };
    let temporaryStartPeriod = startPeriod;
    while (isBefore(temporaryStartPeriod, endPeriod)) {
        const startPeriodString = formatDate(temporaryStartPeriod, "yyyy.MM");
        if (startPeriodString !== null) {
            let value: number = 0;
            let bookindDate: string = "";
            for (const period of category.periods) {
                if (period.period === startPeriodString) {
                    if (isFixedCategoryTrendPeriod(period)) {
                        value += period.value;
                        bookindDate = " " + period.bookingDate;
                    }
                    if (isVariableCategoryTrendPeriod(period)) {
                        value += period.sum;
                    }
                }
            }

            if (
                trend.type === TransactionType.Fixed ||
                trend.type === TransactionType.Income
            ) {
                row[startPeriodString] = `${roundToString(
                    value,
                )} ${currency}${bookindDate}`;
            } else {
                row[startPeriodString] = `${roundToString(value)} ${currency}`;
            }
            temporaryStartPeriod = addMonths(temporaryStartPeriod, 1);
        }
    }
    return row;
};
