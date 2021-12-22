import { formatDate, parseDateString } from "../../utils/dates";
import {
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByDateString,
} from "../../utils/filters";
import { sortTransactionsByDate } from "../../utils/sorters";
import { isApplicationError, isCategory } from "../../utils/typeguards";
import { log } from "../../utils/loggers";
import { Periods, TransactionType } from "../../types/enums";

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

    const lastTransaction = matchedTransactions[matchedTransactions.length - 1];
    const period = getPeriodFromTransactions(matchedTransactions);
    const isPaid = isPaidThisPeriod(lastTransaction, period, filterOptions);
    if (isApplicationError(isPaid)) return isPaid;

    const result: FixedPayDay = {
        value: 0,
        isPaid,
        lastBookingDays: [],
        averageBookingDay: 0,
        transactions: [],
    };

    result.value = lastTransaction.value;
    if (period === Periods.Quarter) {
        result.value = result.value / 3;
    }
    if (period === Periods.Yearly) {
        result.value = result.value / 12;
    }

    for (const matchedTransaction of matchedTransactions) {
        result.lastBookingDays.push(matchedTransaction.day);
        result.averageBookingDay += matchedTransaction.day;
    }

    result.averageBookingDay = Math.floor(
        result.averageBookingDay / matchedTransactions.length,
    );
    result.transactions = matchedTransactions;

    return result;
};

/**
 * Returns a given period from a transaction if its defined.
 *
 * @param transactions
 * @returns The period of a transaction, if its defined in a transaction object
 * and available in Periods enumeration.
 * Otherwise period "monthly" is always returned.
 */
const getPeriodFromTransactions = (transactions: Transaction[]): string => {
    let period = Periods.Monthly;

    if (transactions.length === 0) return period;
    const firstTransaction = transactions[0];
    if (
        isCategory(firstTransaction.category) &&
        typeof firstTransaction.category.period === "string"
    ) {
        for (const categoryPeriod of Object.values(Periods)) {
            if (firstTransaction.category.period === categoryPeriod)
                return firstTransaction.category.period;
        }
    }

    return period;
};

/**
 * Determines if a transaction is paid in its period.
 *
 * @param transaction
 * @param period monthly, yearly, quarter or undefined
 * @param filterOptions
 * @returns true, when the transaction was paid in the given period,
 * false otherwise
 */
const isPaidThisPeriod = (
    transaction: Transaction,
    period: string | undefined,
    filterOptions: FilterTransactionsByCategoryOptions,
): boolean | ApplicationError => {
    const monthYear = getComparsionMonthYear(filterOptions);
    if (isApplicationError(monthYear)) return monthYear;

    if (typeof period === "undefined" || period === Periods.Monthly) {
        return (
            transaction.month === monthYear.month &&
            transaction.year === monthYear.year
        );
    }

    if (period === Periods.Yearly) {
        return transaction.year === monthYear.year;
    }

    if (period === Periods.Quarter) {
        return (
            transaction.year === monthYear.year &&
            monthYear.month - transaction.month < 3
        );
    }

    return false;
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
    matchedTransactions = filterTransactionsByDateString(
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
        TransactionType.Fixed,
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
        if (!fixedPayDay.isPaid) unpaidSum += fixedPayDay.value;
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
