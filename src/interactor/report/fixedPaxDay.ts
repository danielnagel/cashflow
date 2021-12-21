import { formatDate, parseDateString } from "../../utils/dates";
import {
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByDate,
} from "../../utils/filters";
import { sortTransactionsByDate } from "../../utils/sorters";
import { isApplicationError } from "../../utils/typeguards";
import { log } from "../../utils/loggers";
import { CategoryType } from "../../types/enums";

/**
 * Generates a FixedPayDay object from a list of Transaction considering given FilterTransactionsBySampleOptions.
 *
 * @param transactions which are used as a data basis
 * @param filterOptions specify how to filter the transactions
 * @returns FixedPayDay object or an ApplicationError when there are no transactions,
 * no transactions matched by filter or by malformed configuration.
 */
export const generateFixedPayDay = (
    fixedTransactions: Transaction[],
    filterOptions: FilterTransactionsByCategoryOptions,
): FixedPayDay | ApplicationError => {
    if (fixedTransactions.length === 0)
        return {
            source: "fixedPayDay.ts",
            message: "There are no transactions.",
        };

    const matchedTransactions = getSortedMatchedTransactions(
        fixedTransactions,
        filterOptions,
    );
    if (isApplicationError(matchedTransactions)) return matchedTransactions;

    const result: FixedPayDay = {
        value: 0,
        isPaidThisMonth: false,
        lastBookingDays: [],
        averageBookingDay: 0,
        transactions: [],
    };
    result.value = matchedTransactions[matchedTransactions.length - 1].value;

    const monthYear = getComparsionMonthYear(filterOptions);
    if (isApplicationError(monthYear)) return monthYear;

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
        if (
            matchedTransaction.month === monthYear.month &&
            matchedTransaction.year === monthYear.year
        )
            result.isPaidThisMonth = true;
    }

    result.averageBookingDay = Math.floor(
        result.averageBookingDay / matchedTransactions.length,
    );
    result.transactions = matchedTransactions;

    return result;
};

/**
 * Matches transactions by filtering options.
 * Result is sorted by date.
 *
 * @param transactions which are used as a data basis
 * @param filterOptions specify how to filter the transactions
 * @returns sorted matched transactions
 */
const getSortedMatchedTransactions = (
    transactions: Transaction[],
    filterOptions: FilterTransactionsByCategoryOptions,
): Transaction[] | ApplicationError => {
    let matchedTransactions = filterTransactionsByCategoryName(
        transactions,
        filterOptions.category.name,
    );
    matchedTransactions = filterTransactionsByDate(
        matchedTransactions,
        filterOptions,
    );
    if (matchedTransactions.length === 0)
        return {
            source: "fixedPayDay.ts",
            message: "No transactions matched by filter.",
        };

    sortTransactionsByDate(matchedTransactions);
    return matchedTransactions;
};

/**
 * Determines which month of a year is used for comparsion.
 *
 * @param filterOptions specify how to filter the transactions
 * @returns month of a year
 */
const getComparsionMonthYear = (
    filterOptions: FilterTransactionsByCategoryOptions,
): MonthYear | ApplicationError => {
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (filterOptions.before) {
        const beforeDate = parseDateString(
            filterOptions.before,
            filterOptions.dateFormat,
        );
        if (!beforeDate)
            return {
                source: "fixedPayDay.ts",
                message: `Before date filter options can't be parse! Before date is '${beforeDate}'`,
            };
        month = beforeDate.getMonth() + 1;
        year = beforeDate.getFullYear();
    }
    return { month, year };
};

/**
 * Generates a fixed pay day report.
 * The samples of every category are used to match the correct transactions.
 * Configuration made by the user affects the accuracy of this report.
 *
 * @param transactions which are used as a data basis
 * @param categorizeOptions specifies how to categorize generated fix costs
 * @param loggerOptions (optional) to control logging behaviour
 * @returns FixedPayDay object or ApplicationError when there are no transaction,
 * no categories or no categories could be matched.
 */
export const generateFixedPayDayReport = (
    transactions: Transaction[],
    reportOptions: FixedPayDayOptions,
    categorizeOptions: CategorizeOptions,
    loggerOptions?: LoggerOptions,
): CategorizedFixedPayDays | ApplicationError => {
    if (transactions.length == 0) {
        return {
            source: "fixedPayDay.ts",
            message: "There are no transactions.",
        };
    }

    const fixedTransactions: Transaction[] = filterTransactionsByCategoryType(
        transactions,
        CategoryType.Fixed,
    );

    const namedFixedPayDay: NamedFixedPayDay[] = [];
    let sum = 0;
    let unpaidSum = 0;
    for (const category of categorizeOptions.categories) {
        const fixedPayDay = generateFixedPayDay(fixedTransactions, {
            category,
            before: reportOptions.before,
            after: reportOptions.after,
        });
        if (isApplicationError(fixedPayDay)) {
            log({
                message: fixedPayDay,
                level: "error",
                allowedLogLevel: loggerOptions?.allowedLogLevel,
                dateTimeFormat: loggerOptions?.dateTimeFormat,
            });
            continue;
        }

        namedFixedPayDay.push({ name: category.name, fixedPayDay });
        sum += fixedPayDay.value;
        if (!fixedPayDay.isPaidThisMonth) unpaidSum += fixedPayDay.value;
    }

    if (namedFixedPayDay.length === 0)
        return {
            source: "fixedPayDay.ts",
            message: "Couldn't match any categories.",
        };

    return {
        date: generateReportDateString(reportOptions),
        sum,
        unpaidSum,
        namedFixedPayDays: namedFixedPayDay,
    };
};

/**
 * Generates a date string for the report.
 * It can either be the before date from categorizing options
 * or the current date.
 *
 * @param categorizeOptions specifies how to categorize generated fix costs
 * @returns date string
 */
const generateReportDateString = (
    categorizeOptions: FixedPayDayOptions,
): string => {
    let date = categorizeOptions.before
        ? categorizeOptions.before
        : formatDate(new Date());
    if (date === null) date = new Date().toLocaleDateString();
    return date;
};
