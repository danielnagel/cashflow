import { addMonths, isBefore } from "date-fns";
import { TransactionType } from "../../types/enums";
import {
    formatDate,
    getDateFromTransaction,
    parseDateString,
} from "../../utils/dates";
import {
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByPeriod,
} from "../../utils/filters";
import { log } from "../../utils/loggers";
import { round } from "../../utils/numbers";
import { isApplicationError } from "../../utils/typeguards";

/**
 * Generates a trend report for every transaction type.
 * @param options
 */
export const generateTrendReport = (
    options: TrendOptions,
    transactions: Transaction[],
): TrendReport | null => {
    return null;
};

/**
 * Generates a trend object for a specific transaction type.
 * @param options
 */
export const generateTrend = (
    options: TrendOptions,
    transactions: Transaction[],
): Trend | null => {
    return null;
};

/**
 * Generates a category trend object
 * for a specific transaction type and category.
 * The category trend object is used for a category row of a trend.
 *
 * @param options
 * @param transactions that are used as data bases
 * @param logOptions used for the logger
 * @returns CategoryTrend or an ApplicationError
 */
export const generateCategoryTrend = (
    options: CategoryTrendOptions,
    transactions: Transaction[],
    logOptions?: LoggerOptions,
): CategoryTrend | ApplicationError => {
    if (transactions.length === 0)
        return { source: "trend.ts", message: "There where no transactions." };

    if (!isValidTransactionType(options))
        return {
            source: "trend.ts",
            message: `The transaction type '${options.type}' is unknown.`,
        };

    const oldestTransactionDate = getOldestTransactionDate(transactions);
    const stringPeriods = generatePeriods(oldestTransactionDate);
    const periods: Array<
        FixedCategoryTrendPeriod | VariableCategoryTrendPeriod
    > = [];
    for (const period of stringPeriods) {
        const trendPeriod = generateCategoryTrendPeriod(
            { type: options.type, category: options.category, period },
            transactions,
        );
        if (isApplicationError(trendPeriod)) {
            log({
                message: trendPeriod,
                allowedLogLevel: logOptions?.allowedLogLevel,
            });
            continue;
        }
        periods.push(trendPeriod);
    }
    if (periods.length === 0)
        return { source: "trend.ts", message: "No transactions matched." };
    return { name: options.category, periods };
};

/**
 * Searches the oldest transactions date in a list of transactions.
 *
 * @param transactions to search through
 * @returns a javascript Date object of the oldest transaction
 * or the current date.
 */
const getOldestTransactionDate = (transactions: Transaction[]): Date => {
    let oldestDate = new Date();
    for (const transaction of transactions) {
        const transactionDate = getDateFromTransaction(transaction);
        if (isBefore(transactionDate, oldestDate)) oldestDate = transactionDate;
    }
    return oldestDate;
};

/**
 * Generates a list of monthly periods,
 * from a given date until today.
 * @param from date to start from
 * @returns a list of periods,
 * that looks like this ["2020.09", ..., "2021.12"]
 */
const generatePeriods = (from: Date): string[] => {
    const periods: string[] = [];
    const until = new Date();
    do {
        periods.push(`${formatDate(from, "yyyy.MM")}`);
        from = addMonths(from, 1);
    } while (isBefore(from, until));
    return periods;
};

/**
 * Generates a category trend period object for a specific transaction type,
 * category and period.
 * The category trend period object is used to generate a single cell,
 * in a period column, for a category row of a category trend.
 *
 * @param options
 * @param transactions that are used as data bases
 * @returns Fixed or variable category trend period or an ApplicationError
 */
export const generateCategoryTrendPeriod = (
    options: CategoryTrendPeriodOptions,
    transactions: Transaction[],
):
    | FixedCategoryTrendPeriod
    | VariableCategoryTrendPeriod
    | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "There where no transactions.",
        };

    if (!isValidTransactionType(options))
        return {
            source: "trend.ts",
            message: `The transaction type '${options.type}' is unknown.`,
        };

    const period = parseDateString(options.period, "yyyy.MM");
    if (period === null)
        return {
            source: "trend.ts",
            message: `Period option '${options.period}' has the wrong format!`,
        };

    let matchedTransactions = filterTransactionsByCategoryType(
        transactions,
        options.type,
    );
    matchedTransactions = filterTransactionsByCategoryName(
        matchedTransactions,
        options.category,
    );
    matchedTransactions = filterTransactionsByPeriod(
        matchedTransactions,
        options.period,
    );

    if (
        options.type === TransactionType.Fixed ||
        options.type === TransactionType.Income
    )
        return createFixedCategoryTrendPeriod(options, matchedTransactions);

    return createVariableCategoryTrendPeriod(options, matchedTransactions);
};

/**
 * Checks if a transaction type is valid.
 * @param options category trend options
 * @returns true when transactio type is fixed, variable, income or special,
 * false otherwise
 */
const isValidTransactionType = (options: CategoryTrendOptions): boolean => {
    for (const type of Object.values(TransactionType)) {
        if (type === options.type) return true;
    }
    return false;
};

/**
 * Creates a category trend period for a fixed transaction type,
 * which is used for a single cell in a category row,
 * period column of a trend report.
 *
 * @param options category trend options
 * @param transactions that where filtered before
 * and are used to create the FixedCategoryTrendPeriod object
 * @returns FixedCategoryTrendPeriod object or an ApplicationError
 */
const createFixedCategoryTrendPeriod = (
    options: CategoryTrendPeriodOptions,
    transactions: Transaction[],
): FixedCategoryTrendPeriod | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "No transactions matched.",
        };

    const lastTransaction = transactions[transactions.length - 1];
    let bookingDate = formatDate(getDateFromTransaction(lastTransaction));
    if (bookingDate === null)
        bookingDate =
            getDateFromTransaction(lastTransaction).toLocaleDateString();

    return {
        value: lastTransaction.value,
        bookingDate,
        period: options.period,
        transactions,
    };
};

/**
 * Creates a category trend period for a variable transaction type,
 * which is used for a single cell in a category row,
 * period column of a trend report.
 *
 * @param options category trend options
 * @param transactions that where filtered before
 * and are used to create the FixedCategoryTrendPeriod object
 * @returns FixedCategoryTrendPeriod object or an ApplicationError
 */
const createVariableCategoryTrendPeriod = (
    options: CategoryTrendPeriodOptions,
    transactions: Transaction[],
): VariableCategoryTrendPeriod | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "No transactions matched.",
        };

    let sum = 0;
    for (const transaction of transactions) {
        sum += transaction.value;
    }
    sum = round(sum);

    return {
        sum,
        period: options.period,
        transactions,
    };
};
