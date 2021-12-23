import {
    generateCategoryTrendPeriod,
    generateCategoryTrend,
    generateTrend,
    generateTrendReport,
} from "../../../src/interactor/report/trend";
import { categorizedTransactions } from "./samples/categorizedTransactions";
import {
    fixedTrendPeriodForOneCategory,
    variableTrendPeriodForOneCategory,
    incomeTrendPeriodForOneCategory,
    specialTrendPeriodForOneCategory,
    fixedSingleCategoryTrend,
    variableSingleCategoryTrend,
    incomeSingleCategoryTrend,
    specialSingleCategoryTrend,
    trendForFixedSingleCategory,
    trendForVariableSingleCategory,
    trendForIncomeSingleCategory,
    trendForSpecialSingleCategory,
    trendForFixed,
    trendForVariable,
    fixedTrendReport,
    variableTrendReport,
    incomeTrendReport,
    specialTrendReport,
    trendReport,
} from "./samples/expected";

describe("Test report/trend", () => {
    describe("Test function generateCategoryTrendPeriod", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "mobile",
                type: "fixed",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(options, []);
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "hello",
                type: "random",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "water",
                type: "fixed",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when period has the wrong format", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "water",
                type: "fixed",
                period: "2021/09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "Period option '2021/09' has the wrong format!",
            });
        });

        test("Generate a fixed trend period for one category", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "mobile",
                type: "fixed",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );

            expect(result).toStrictEqual(fixedTrendPeriodForOneCategory);
        });

        test("Generate a variable trend period for one category", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "groceries",
                type: "variable",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );

            expect(result).toStrictEqual(variableTrendPeriodForOneCategory);
        });

        test("Generate a income trend period for one category", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "salary",
                type: "income",
                period: "2021.09",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );

            expect(result).toStrictEqual(incomeTrendPeriodForOneCategory);
        });

        test("Generate a special trend period for one category", () => {
            const options: CategoryTrendPeriodOptions = {
                category: "home",
                type: "special",
                period: "2021.10",
            };
            const result = generateCategoryTrendPeriod(
                options,
                categorizedTransactions,
            );

            expect(result).toStrictEqual(specialTrendPeriodForOneCategory);
        });
    });

    describe("Test function generateCategoryTrend", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const options: CategoryTrendOptions = {
                category: "mobile",
                type: "fixed",
            };
            const result = generateCategoryTrend(options, [], {
                allowedLogLevel: "none",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const options: CategoryTrendOptions = {
                category: "hello",
                type: "random",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const options: CategoryTrendOptions = {
                category: "water",
                type: "fixed",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Generate a fixed trend for one category", () => {
            const options: CategoryTrendOptions = {
                category: "mobile",
                type: "fixed",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );

            expect(result).toStrictEqual(fixedSingleCategoryTrend);
        });

        test("Generate a variable trend period for one category", () => {
            const options: CategoryTrendOptions = {
                category: "groceries",
                type: "variable",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );

            expect(result).toStrictEqual(variableSingleCategoryTrend);
        });

        test("Generate a income trend period for one category", () => {
            const options: CategoryTrendOptions = {
                category: "salary",
                type: "income",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );

            expect(result).toStrictEqual(incomeSingleCategoryTrend);
        });

        test("Generate a special trend period for one category", () => {
            const options: CategoryTrendOptions = {
                category: "home",
                type: "special",
            };
            const result = generateCategoryTrend(
                options,
                categorizedTransactions,
                { allowedLogLevel: "none" },
            );

            expect(result).toStrictEqual(specialSingleCategoryTrend);
        });
    });

    describe("Test function generateTrend", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const options: TrendOptions = {
                categories: ["mobile"],
                type: "fixed",
            };
            const result = generateTrend(options, [], {
                allowedLogLevel: "none",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const options: TrendOptions = {
                categories: ["hello"],
                type: "random",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const options: TrendOptions = {
                categories: ["water"],
                type: "fixed",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when categories array is empty", () => {
            const options: TrendOptions = {
                categories: [],
                type: "fixed",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No categories avaialable.",
            });
        });

        test("Generate a fixed trend for a single category", () => {
            const options: TrendOptions = {
                categories: ["mobile"],
                type: "fixed",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForFixedSingleCategory);
        });

        test("Generate a variable trend for a single category", () => {
            const options: TrendOptions = {
                categories: ["groceries"],
                type: "variable",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForVariableSingleCategory);
        });

        test("Generate a income trend for a single category", () => {
            const options: TrendOptions = {
                categories: ["salary"],
                type: "income",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForIncomeSingleCategory);
        });

        test("Generate a special trend for a single category", () => {
            const options: TrendOptions = {
                categories: ["home"],
                type: "special",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForSpecialSingleCategory);
        });

        test("Generate a fixed trend for all categories", () => {
            const options: TrendOptions = {
                categories: [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                ],
                type: "fixed",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForFixed);
        });

        test("Generate a variable trend", () => {
            const options: TrendOptions = {
                categories: ["food", "groceries", "presents", "shopping"],
                type: "variable",
            };
            const result = generateTrend(options, categorizedTransactions, {
                allowedLogLevel: "none",
            });

            expect(result).toStrictEqual(trendForVariable);
        });
    });

    describe("Test function generateTrendReport", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const result = generateTrendReport(
                ["water"],
                [],
                {},
                {
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const result = generateTrendReport(
                ["water"],
                categorizedTransactions,
                { type: "random" },
                {
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const result = generateTrendReport(
                ["water"],
                categorizedTransactions,
                {},
                {
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when categories array is empty", () => {
            const result = generateTrendReport(
                [],
                categorizedTransactions,
                {},
                {
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No categories avaialable.",
            });
        });

        test("Generate a trend report, all categories, fixed transaction type", () => {
            const result = generateTrendReport(
                [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                    "salary",
                    "home",
                    "food",
                    "groceries",
                    "presents",
                    "shopping",
                ],
                categorizedTransactions,
                { type: "fixed" },
                {
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(fixedTrendReport);
        });

        test("Generate a trend report, all categories, variable transaction type", () => {
            const result = generateTrendReport(
                [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                    "salary",
                    "home",
                    "food",
                    "groceries",
                    "presents",
                    "shopping",
                ],
                categorizedTransactions,
                { type: "variable" },
                {
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(variableTrendReport);
        });

        test("Generate a trend report, all categories, income transaction type", () => {
            const result = generateTrendReport(
                [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                    "salary",
                    "home",
                    "food",
                    "groceries",
                    "presents",
                    "shopping",
                ],
                categorizedTransactions,
                { type: "income" },
                {
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(incomeTrendReport);
        });

        test("Generate a trend report, all categories, special transaction type", () => {
            const result = generateTrendReport(
                [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                    "salary",
                    "home",
                    "food",
                    "groceries",
                    "presents",
                    "shopping",
                ],
                categorizedTransactions,
                { type: "special" },
                {
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(specialTrendReport);
        });

        test("Generate a trend report, all categories, all transaction types", () => {
            const result = generateTrendReport(
                [
                    "car insurance",
                    "luxury",
                    "rent",
                    "insurance",
                    "mobile",
                    "music subscription",
                    "gaming subscription",
                    "salary",
                    "home",
                    "food",
                    "groceries",
                    "presents",
                    "shopping",
                ],
                categorizedTransactions,
                {},
                {
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(trendReport);
        });
    });
});

// -- test list
// weekly reports
// yearly reports
