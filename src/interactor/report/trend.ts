import { addMonths, isBefore } from "date-fns";
import { TransactionType } from "../../types/enums";
import { formatDate, parseDateString } from "../../utils/dates";
import {
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByPeriod,
} from "../../utils/filters";
import { round } from "../../utils/numbers";
import { isApplicationError } from "../../utils/typeguards";

/**
 * Generates a trend report object
 * for every or a specific transaction type.
 * The result is either generating a summary of all transaction types
 * or a trend report showing every category of one transaction type.
 *
 * @param categories which can be found
 * @param transactions that are used as data bases
 * @param options allows to only generate a detailed report for one category
 * @param logOptions used for the logger
 * @returns TrendReport or an ApplicationError
 */
export const generateTrendReport = (
    transactions: Transaction[],
    options: Configuration,
    args: Arguments,
): TrendReport | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "There are no transactions.",
        };

    if (options.categories.length === 0)
        return {
            source: "trend.ts",
            message: "No categories avaialable.",
        };

    if (
        typeof options !== "undefined" &&
        typeof args.trendType !== "undefined"
    ) {
        if (!isValidTransactionType(args.trendType)) {
            return {
                source: "trend.ts",
                message: `The transaction type '${args.trendType}' is unknown.`,
            };
        }
        const trend = generateTrend(transactions, args.trendType, options);
        if (isApplicationError(trend)) return trend;
        return { trendType: args.trendType, trends: [trend] };
    }

    const trendReport: TrendReport = { trends: [] };
    for (const type of Object.values(TransactionType)) {
        const trend = generateTrend(transactions, type, options);
        if (isApplicationError(trend)) continue;
        trendReport.trends.push(trend);
    }

    if (trendReport.trends.length === 0)
        return { source: "trend.ts", message: "No transactions matched." };

    return trendReport;
};

/**
 * Generates a trend object
 * for a specific transaction type.
 * The trend object is used for a transaction type row of a trend report
 * or a trend report showing every category of one transaction type.
 *
 * @param options
 * @param transactions that are used as data bases
 * @param logOptions used for the logger
 * @returns Trend or an ApplicationError
 */
export const generateTrend = (
    transactions: Transaction[],
    type: string,
    options: Configuration,
): Trend | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "There where no transactions.",
        };

    if (options.categories.length === 0)
        return {
            source: "trend.ts",
            message: "No categories avaialable.",
        };

    if (!isValidTransactionType(type))
        return {
            source: "trend.ts",
            message: `The transaction type '${type}' is unknown.`,
        };

    const trend: Trend = { type: type, categories: [] };
    for (const category of options.categories) {
        const categoryTrend = generateCategoryTrend(
            transactions,
            type,
            category.name,
            options,
        );
        if (isApplicationError(categoryTrend)) continue;
        trend.categories.push(categoryTrend);
    }
    if (trend.categories.length === 0)
        return { source: "trend.ts", message: "No transactions matched." };

    return trend;
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
    transactions: Transaction[],
    type: string,
    categoryName: string,
    options: Configuration,
): CategoryTrend | ApplicationError => {
    if (transactions.length === 0)
        return { source: "trend.ts", message: "There where no transactions." };

    if (!isValidTransactionType(type))
        return {
            source: "trend.ts",
            message: `The transaction type '${type}' is unknown.`,
        };

    const stringPeriods = generatePeriods(transactions, options);
    const categoryTrend: CategoryTrend = {
        name: categoryName,
        periods: [],
    };
    for (const period of stringPeriods) {
        const trendPeriod = generateCategoryTrendPeriod(
            transactions,
            type,
            categoryName,
            period,
            options,
        );
        if (isApplicationError(trendPeriod)) {
            continue;
        }
        categoryTrend.periods.push(trendPeriod);
    }
    if (categoryTrend.periods.length === 0)
        return { source: "trend.ts", message: "No transactions matched." };
    return categoryTrend;
};

/**
 * Searches the oldest transactions date in a list of transactions.
 *
 * @param transactions to search through
 * @param options configuration made by the user, to get a custom start date
 * @returns a javascript Date object of the oldest transaction
 * or the current date.
 */
const getOldestTransactionDate = (
    transactions: Transaction[],
    options: Configuration,
): Date => {
    if (typeof options.startDate !== "undefined") {
        const startDate = parseDateString(
            options.startDate,
            options.dateFormat,
        );
        if (startDate !== null) return startDate;
    }
    let oldestDate = new Date();
    for (const transaction of transactions) {
        const transactionDate = transaction.date;
        if (isBefore(transactionDate, oldestDate)) oldestDate = transactionDate;
    }
    return oldestDate;
};

/**
 * Generates a list of monthly periods,
 * for a specific period.
 * @param transactions to get the oldest period from
 * @param options configuration made by the user, to shrink the available periods
 * @returns a list of periods,
 * that looks like this ["2020.09", ..., "2021.12"]
 */
const generatePeriods = (
    transactions: Transaction[],
    options: Configuration,
): string[] => {
    const periods: string[] = [];
    let startDate = getOldestTransactionDate(transactions, options);
    let endDate = new Date();
    if (typeof options.endDate !== "undefined") {
        const parsedDate = parseDateString(options.endDate, options.dateFormat);
        if (parsedDate !== null) endDate = parsedDate;
    }
    do {
        periods.push(`${formatDate(startDate, "yyyy.MM")}`);
        startDate = addMonths(startDate, 1);
    } while (isBefore(startDate, endDate));
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
    transactions: Transaction[],
    type: string,
    categoryName: string,
    stringPeriod: string,
    options: Configuration,
):
    | FixedCategoryTrendPeriod
    | VariableCategoryTrendPeriod
    | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "There where no transactions.",
        };

    if (!isValidTransactionType(type))
        return {
            source: "trend.ts",
            message: `The transaction type '${type}' is unknown.`,
        };

    const period = parseDateString(stringPeriod, "yyyy.MM");
    if (period === null)
        return {
            source: "trend.ts",
            message: `Period option '${stringPeriod}' has the wrong format!`,
        };

    let matchedTransactions = filterTransactionsByCategoryType(
        transactions,
        type,
    );
    matchedTransactions = filterTransactionsByCategoryName(
        matchedTransactions,
        categoryName,
    );
    matchedTransactions = filterTransactionsByPeriod(
        matchedTransactions,
        stringPeriod,
    );

    if (type === TransactionType.Fixed || type === TransactionType.Income)
        return createFixedCategoryTrendPeriod(
            matchedTransactions,
            stringPeriod,
            options,
        );

    return createVariableCategoryTrendPeriod(matchedTransactions, stringPeriod);
};

/**
 * Checks if a string is a valid transaction type.
 *
 * @param transactionType
 * @returns true when transactio type is fixed, variable, income or special,
 * false otherwise
 */
const isValidTransactionType = (transactionType: string): boolean => {
    for (const type of Object.values(TransactionType)) {
        if (type === transactionType) return true;
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
    transactions: Transaction[],
    period: string,
    options: Configuration,
): FixedCategoryTrendPeriod | ApplicationError => {
    if (transactions.length === 0)
        return {
            source: "trend.ts",
            message: "No transactions matched.",
        };

    const lastTransaction = transactions[transactions.length - 1];
    let bookingDate = formatDate(lastTransaction.date, options.dateFormat);
    if (bookingDate === null)
        return {
            source: "trend.ts",
            message: "Could not format date from latest transaction.",
        };

    return {
        value: lastTransaction.value,
        bookingDate,
        period,
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
    transactions: Transaction[],
    period: string,
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
        period,
        transactions,
    };
};
