import { formatDate, parseDateString } from "../../utils/dates";
import {
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByDateString,
} from "../../utils/filters";
import { sortTransactionsByDate } from "../../utils/sorters";
import { isApplicationError, isCategory } from "../../utils/typeguards";
import { Periods, TransactionType } from "../../types/enums";
import {
    differenceInMonths,
    differenceInYears,
    isSameMonth,
    isSameQuarter,
} from "date-fns";

/**
 * Generates a FixedPayDay object from a list of Transaction considering given FilterTransactionsBySampleOptions.
 *
 * @param transactions which are used as a data basis
 * @param filterOptions specify how to filter the transactions
 * @returns FixedPayDay object or an ApplicationError when there are no transactions,
 * no transactions matched by filter or by malformed configuration.
 */
export const generateFixedPayDay = (
    fixedTransactions: ExtendedTransaction[],
    categoryName: string,
    options: Configuration,
): FixedPayDay | ApplicationError => {
    if (fixedTransactions.length === 0)
        return {
            source: "fixedPayDay.ts",
            message: "There are no transactions.",
        };

    const matchedTransactions = getSortedMatchedTransactions(
        fixedTransactions,
        categoryName,
        options,
    );
    if (isApplicationError(matchedTransactions)) return matchedTransactions;

    const lastTransaction = matchedTransactions[matchedTransactions.length - 1];
    const period = getPeriodFromTransactions(matchedTransactions);
    const isPaid = isPaidThisPeriod(lastTransaction, period, options);
    if (isApplicationError(isPaid)) return isPaid;

    if (isOldCategory(period, lastTransaction)) {
        return {
            source: "fixedPayDay.ts",
            message: `Category "${categoryName}" is to old and got removed from report.`,
        };
    }

    const result: FixedPayDay = {
        value: 0,
        isPaid,
        transactions: [],
    };

    result.value = lastTransaction.value;
    if (result.value < 0) result.value *= -1;
    if (period === Periods.Quarter) {
        result.value = result.value / 3;
    }
    if (period === Periods.Yearly) {
        result.value = result.value / 12;
    }
    result.transactions = matchedTransactions;

    return result;
};

/**
 * Checks if a category is to old and should be removed from report.
 * To old means:
 * Period = monthly => latest transaction not older than 3 months
 * Period = quarter => latest transaction not older than 9 months
 * Period = yearly => latest transaction not older than 2 years
 *
 * @param period of the category
 * @param transaction to check
 * @returns true if its to old, false otherwise
 */
const isOldCategory = (
    period: string,
    transaction: ExtendedTransaction,
): boolean => {
    return (
        (period === Periods.Monthly &&
            differenceInMonths(new Date(), transaction.date) > 3) ||
        (period === Periods.Quarter &&
            differenceInMonths(new Date(), transaction.date) > 9) ||
        (period === Periods.Yearly &&
            differenceInYears(new Date(), transaction.date) > 2)
    );
};

/**
 * Returns a given period from a transaction if its defined.
 *
 * @param transactions
 * @returns The period of a transaction, if its defined in a transaction object
 * and available in Periods enumeration.
 * Otherwise period "monthly" is always returned.
 */
const getPeriodFromTransactions = (
    transactions: ExtendedTransaction[],
): string => {
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

    return Periods.Monthly;
};

/**
 * Determines if a transaction is paid in its period.
 *
 * @param transaction
 * @param period monthly, yearly, quarter or undefined
 * @param options
 * @returns true, when the transaction was paid in the given period,
 * false otherwise
 */
const isPaidThisPeriod = (
    transaction: Transaction,
    period: string | undefined,
    options: Configuration,
): boolean | ApplicationError => {
    const comparsionDate = getComparsionDate(options);
    if (isApplicationError(comparsionDate)) return comparsionDate;

    if (typeof period === "undefined" || period === Periods.Monthly) {
        return isSameMonth(transaction.date, comparsionDate);
    }

    if (period === Periods.Yearly) {
        return differenceInYears(transaction.date, comparsionDate) <= 1;
    }

    return (
        period === Periods.Quarter &&
        isSameQuarter(transaction.date, comparsionDate)
    );
};

/**
 * Matches transactions by filtering options.
 * Result is sorted by date.
 *
 * @param transactions which are used as a data basis
 * @param categoryName to filter by
 * @param options Configuration
 * @returns sorted matched transactions
 */
const getSortedMatchedTransactions = (
    transactions: ExtendedTransaction[],
    categoryName: string,
    options: Configuration,
): ExtendedTransaction[] | ApplicationError => {
    let matchedTransactions = filterTransactionsByCategoryName(
        transactions,
        categoryName,
    );
    matchedTransactions = filterTransactionsByDateString(
        matchedTransactions,
        options,
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
 * @param options specify how to filter the transactions
 * @returns month of a year
 */
const getComparsionDate = (options: Configuration): Date | ApplicationError => {
    if (options.endDate) {
        const endDate = parseDateString(options.endDate, options.dateFormat);
        if (!endDate)
            return {
                source: "fixedPayDay.ts",
                message: `Before date filter options can't be parse! Before date is '${options.endDate}'`,
            };
        return endDate;
    }
    return new Date();
};

/**
 * Generates a fixed pay day report.
 * The samples of every category are used to match the correct transactions.
 * Configuration made by the user affects the accuracy of this report.
 *
 * @param transactions which are used as a data basis
 * @param options specifies how to categorize generated fix costs
 * @returns FixedPayDay object or ApplicationError when there are no transaction,
 * no categories or no categories could be matched.
 */
export const generateFixedPayDayReport = (
    transactions: ExtendedTransaction[],
    options: Configuration,
): CategorizedFixedPayDays | ApplicationError => {
    if (transactions.length == 0) {
        return {
            source: "fixedPayDay.ts",
            message: "There are no transactions.",
        };
    }

    const fixedTransactions = filterTransactionsByCategoryType(
        transactions,
        TransactionType.Fixed,
    );

    const namedFixedPayDay: NamedFixedPayDay[] = [];
    let sum = 0;
    let unpaidSum = 0;
    for (const category of options.categories) {
        const fixedPayDay = generateFixedPayDay(
            fixedTransactions,
            category.name,
            options,
        );
        if (isApplicationError(fixedPayDay)) {
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
        sum,
        unpaidSum,
        namedFixedPayDays: namedFixedPayDay,
    };
};
