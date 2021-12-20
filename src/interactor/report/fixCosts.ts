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
 * Generates a FixCost object from a list of Transaction considering given FilterTransactionsBySampleOptions.
 *
 * @param transactions which are used as a data basis
 * @param filterOptions specify how to filter the transactions
 * @returns FixCost object or an ApplicationError when there are no transactions,
 * no transactions matched by filter or by malformed configuration.
 */
export const generateFixCost = (
    fixedTransactions: Transaction[],
    filterOptions: FilterTransactionsByCategoryOptions,
): FixCost | ApplicationError => {
    if (fixedTransactions.length === 0)
        return { source: "fixCosts.ts", message: "There are no transactions." };

    const matchedTransactions = getSortedMatchedTransactions(
        fixedTransactions,
        filterOptions,
    );
    if (isApplicationError(matchedTransactions)) return matchedTransactions;

    const result: FixCost = {
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
            source: "fixCosts.ts",
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
                source: "fixCosts.ts",
                message: `Before date filter options can't be parse! Before date is '${beforeDate}'`,
            };
        month = beforeDate.getMonth() + 1;
        year = beforeDate.getFullYear();
    }
    return { month, year };
};

/**
 * Generates a categorized fix costs report.
 * The samples of every category are used to match the correct transactions.
 * Configuration made by the user affects the accuracy of this report.
 *
 * @param transactions which are used as a data basis
 * @param categorizeOptions specifies how to categorize generated fix costs
 * @param loggerOptions (optional) to control logging behaviour
 * @returns CategorizedFixCosts object or ApplicationError when there are no transaction,
 * no categories or no categories could be matched.
 */
export const generateCategorizedFixCosts = (
    transactions: Transaction[],
    reportOptions: FixCostOptions,
    categorizeOptions: CategorizeOptions,
    loggerOptions?: LoggerOptions,
): CategorizedFixCosts | ApplicationError => {
    if (transactions.length == 0) {
        return { source: "fixCosts.ts", message: "There are no transactions." };
    }

    const fixedTransactions: Transaction[] = filterTransactionsByCategoryType(
        transactions,
        CategoryType.Fixed,
    );

    const namedFixCost: NamedFixCost[] = [];
    let sum = 0;
    let unpaidSum = 0;
    for (const category of categorizeOptions.categories) {
        const fixCost = generateFixCost(fixedTransactions, {
            category,
            before: reportOptions.before,
            after: reportOptions.after,
        });
        if (isApplicationError(fixCost)) {
            log({
                message: fixCost,
                level: "error",
                allowedLogLevel: loggerOptions?.allowedLogLevel,
                dateTimeFormat: loggerOptions?.dateTimeFormat,
            });
            continue;
        }

        namedFixCost.push({ name: category.name, fixCost });
        sum += fixCost.value;
        if (!fixCost.isPaidThisMonth) unpaidSum += fixCost.value;
    }

    if (namedFixCost.length === 0)
        return {
            source: "fixCosts.ts",
            message: "Couldn't match any categories.",
        };

    return {
        date: generateReportDateString(reportOptions),
        sum,
        unpaidSum,
        fixCosts: namedFixCost,
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
    categorizeOptions: FixCostOptions,
): string => {
    let date = categorizeOptions.before
        ? categorizeOptions.before
        : formatDate(new Date());
    if (date === null) date = new Date().toLocaleDateString();
    return date;
};
