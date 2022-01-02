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
    trendReportAfter,
} from "./samples/expected";

describe("Test report/trend", () => {
    describe("Test function generateCategoryTrendPeriod", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const result = generateCategoryTrendPeriod(
                [],
                "fixed",
                "mobile",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "random",
                "hello",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "fixed",
                "water",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when period has the wrong format", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "fixed",
                "water",
                "2021/09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "Period option '2021/09' has the wrong format!",
            });
        });

        test("Generate a fixed trend period for one category", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "fixed",
                "mobile",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(fixedTrendPeriodForOneCategory);
        });

        test("Generate a variable trend period for one category", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "variable",
                "groceries",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(variableTrendPeriodForOneCategory);
        });

        test("Generate a income trend period for one category", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "income",
                "salary",
                "2021.09",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(incomeTrendPeriodForOneCategory);
        });

        test("Generate a special trend period for one category", () => {
            const result = generateCategoryTrendPeriod(
                categorizedTransactions,
                "special",
                "home",
                "2021.10",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                },
            );

            expect(result).toStrictEqual(specialTrendPeriodForOneCategory);
        });
    });

    describe("Test function generateCategoryTrend", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const result = generateCategoryTrend([], "fixed", "mobile", {
                source: { type: "api" },
                categories: [],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "random",
                "hello",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "fixed",
                "water",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Generate a fixed trend for one category", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "fixed",
                "mobile",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );

            expect(result).toStrictEqual(fixedSingleCategoryTrend);
        });

        test("Generate a variable trend period for one category", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "variable",
                "groceries",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );

            expect(result).toStrictEqual(variableSingleCategoryTrend);
        });

        test("Generate a income trend period for one category", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "income",
                "salary",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );

            expect(result).toStrictEqual(incomeSingleCategoryTrend);
        });

        test("Generate a special trend period for one category", () => {
            const result = generateCategoryTrend(
                categorizedTransactions,
                "special",
                "home",
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
            );

            expect(result).toStrictEqual(specialSingleCategoryTrend);
        });
    });

    describe("Test function generateTrend", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const result = generateTrend([], "fixed", {
                source: { type: "api" },
                categories: [{ name: "mobile", type: "fixed", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There where no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const result = generateTrend(categorizedTransactions, "random", {
                source: { type: "api" },
                categories: [{ name: "hello", type: "random", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const result = generateTrend(categorizedTransactions, "fixed", {
                source: { type: "api" },
                categories: [{ name: "water", type: "fixed", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when categories array is empty", () => {
            const result = generateTrend(categorizedTransactions, "fixed", {
                source: { type: "api" },
                categories: [],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No categories avaialable.",
            });
        });

        test("Generate a fixed trend for a single category", () => {
            const result = generateTrend(categorizedTransactions, "fixed", {
                source: { type: "api" },
                categories: [{ name: "mobile", type: "fixed", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForFixedSingleCategory);
        });

        test("Generate a variable trend for a single category", () => {
            const result = generateTrend(categorizedTransactions, "variable", {
                source: { type: "api" },
                categories: [
                    { name: "groceries", type: "variable", samples: [] },
                ],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForVariableSingleCategory);
        });

        test("Generate a income trend for a single category", () => {
            const result = generateTrend(categorizedTransactions, "income", {
                source: { type: "api" },
                categories: [{ name: "salary", type: "income", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForIncomeSingleCategory);
        });

        test("Generate a special trend for a single category", () => {
            const result = generateTrend(categorizedTransactions, "special", {
                source: { type: "api" },
                categories: [{ name: "home", type: "special", samples: [] }],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForSpecialSingleCategory);
        });

        test("Generate a fixed trend for all categories", () => {
            const result = generateTrend(categorizedTransactions, "fixed", {
                source: { type: "api" },
                categories: [
                    { name: "car insurance", type: "fixed", samples: [] },
                    { name: "luxury", type: "fixed", samples: [] },
                    { name: "rent", type: "fixed", samples: [] },
                    { name: "insurance", type: "fixed", samples: [] },
                    { name: "mobile", type: "fixed", samples: [] },
                    { name: "music subscription", type: "fixed", samples: [] },
                    { name: "gaming subscription", type: "fixed", samples: [] },
                ],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForFixed);
        });

        test("Generate a variable trend for all categories", () => {
            const result = generateTrend(categorizedTransactions, "variable", {
                source: { type: "api" },
                categories: [
                    { name: "food", type: "variable", samples: [] },
                    { name: "groceries", type: "variable", samples: [] },
                    { name: "presents", type: "variable", samples: [] },
                    { name: "shopping", type: "variable", samples: [] },
                ],
                allowedLogLevel: "none",
                endDate: "20.12.2021",
            });

            expect(result).toStrictEqual(trendForVariable);
        });
    });

    describe("Test function generateTrendReport", () => {
        test("Return ApplicationError, when there are no transactions", () => {
            const result = generateTrendReport(
                [],
                {
                    source: { type: "api" },
                    categories: [
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "There are no transactions.",
            });
        });

        test("Return ApplicationError, when type is unknown", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "food", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: "random",
                    configurationPath: "",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "The transaction type 'random' is unknown.",
            });
        });

        test("Return ApplicationError, when no transactions matched", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "water", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No transactions matched.",
            });
        });

        test("Return ApplicationError, when categories array is empty", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                },
            );
            expect(result).toStrictEqual({
                source: "trend.ts",
                message: "No categories avaialable.",
            });
        });

        test("Generate a trend report, all categories, fixed transaction type", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: "fixed",
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(fixedTrendReport);
        });

        test("Generate a trend report, all categories, variable transaction type", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: "variable",
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(variableTrendReport);
        });

        test("Generate a trend report, all categories, income transaction type", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: "income",
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(incomeTrendReport);
        });

        test("Generate a trend report, all categories, special transaction type", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: "special",
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(specialTrendReport);
        });

        test("Generate a trend report, all categories, all transaction types", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    endDate: "20.12.2021",
                },
                {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(trendReport);
        });

        test("Generate a trend report, all categories, all transaction types, with after option that produces a report from period 2021.09", () => {
            const result = generateTrendReport(
                categorizedTransactions,
                {
                    source: { type: "api" },
                    categories: [
                        { name: "car insurance", type: "fixed", samples: [] },
                        { name: "luxury", type: "fixed", samples: [] },
                        { name: "rent", type: "fixed", samples: [] },
                        { name: "insurance", type: "fixed", samples: [] },
                        { name: "mobile", type: "fixed", samples: [] },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [],
                        },
                        { name: "salary", type: "income", samples: [] },
                        { name: "home", type: "special", samples: [] },
                        { name: "food", type: "variable", samples: [] },
                        { name: "groceries", type: "variable", samples: [] },
                        { name: "presents", type: "variable", samples: [] },
                        { name: "shopping", type: "variable", samples: [] },
                    ],
                    allowedLogLevel: "none",
                    startDate: "09/15/2021",
                    dateFormat: "MM/dd/yyyy",
                    endDate: "12/20/2021",
                },
                {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                },
            );

            expect(result).toStrictEqual(trendReportAfter);
        });
    });
});

// -- test list
// weekly reports
// yearly reports
