import {
    generateCategoryTrendPeriod,
    generateCategoryTrend,
} from "../../../src/interactor/report/trend";
import { categorizedTransactions } from "./samples/categorizedTransactions";

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

            const expected: FixedCategoryTrendPeriod = {
                value: 39.99,
                bookingDate: "22.09.2021",
                period: "2021.09",
                transactions: [
                    {
                        day: 22,
                        month: 9,
                        year: 2021,
                        initiator: "Mobilio Ltd.",
                        purpose: "your mobile phone provider",
                        value: 39.99,
                        category: {
                            name: "mobile",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                ],
            };

            expect(result).toStrictEqual(expected);
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
            const expected: VariableCategoryTrendPeriod = {
                sum: 320.59,
                period: "2021.09",
                transactions: [
                    {
                        day: 7,
                        month: 9,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 34 GROCERIE LAND TES7123123",
                        value: 111.96,
                        category: {
                            name: "groceries",
                            type: "variable",
                        },
                    },
                    {
                        day: 16,
                        month: 9,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 34 GROCERIE LAND TES7123123",
                        value: 88.77,
                        category: {
                            name: "groceries",
                            type: "variable",
                        },
                    },
                    {
                        day: 24,
                        month: 9,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 34 GROCERIE LAND TES7123123",
                        value: 119.86,
                        category: {
                            name: "groceries",
                            type: "variable",
                        },
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
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
            const expected: FixedCategoryTrendPeriod = {
                value: 1667.99,
                bookingDate: "28.09.2021",
                period: "2021.09",
                transactions: [
                    {
                        day: 28,
                        month: 9,
                        year: 2021,
                        initiator: "Owl Logistic Corp.",
                        purpose: "Have fun",
                        value: 1667.99,
                        category: {
                            name: "salary",
                            type: "income",
                        },
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
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
            const expected: VariableCategoryTrendPeriod = {
                sum: 2899.98,
                period: "2021.10",
                transactions: [
                    {
                        day: 25,
                        month: 10,
                        year: 2021,
                        initiator: "Kitchen Shop 24/7",
                        purpose:
                            "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
                        value: 2899.98,
                        category: {
                            name: "home",
                            type: "special",
                        },
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
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

            const expected: CategoryTrend = {
                name: "mobile",
                periods: [
                    {
                        value: 39.99,
                        bookingDate: "22.09.2021",
                        period: "2021.09",
                        transactions: [
                            {
                                day: 22,
                                month: 9,
                                year: 2021,
                                initiator: "Mobilio Ltd.",
                                purpose: "your mobile phone provider",
                                value: 39.99,
                                category: {
                                    name: "mobile",
                                    type: "fixed",
                                    period: "monthly",
                                },
                            },
                        ],
                    },
                    {
                        value: 39.99,
                        bookingDate: "22.10.2021",
                        period: "2021.10",
                        transactions: [
                            {
                                day: 22,
                                month: 10,
                                year: 2021,
                                initiator: "Mobilio Ltd.",
                                purpose: "your mobile phone provider",
                                value: 39.99,
                                category: {
                                    name: "mobile",
                                    type: "fixed",
                                    period: "monthly",
                                },
                            },
                        ],
                    },
                    {
                        value: 49.99,
                        bookingDate: "22.11.2021",
                        period: "2021.11",
                        transactions: [
                            {
                                day: 22,
                                month: 11,
                                year: 2021,
                                initiator: "Mobilio Ltd.",
                                purpose: "your mobile phone provider",
                                value: 49.99,
                                category: {
                                    name: "mobile",
                                    type: "fixed",
                                    period: "monthly",
                                },
                            },
                        ],
                    },
                ],
            };

            expect(result).toStrictEqual(expected);
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

            const expected: CategoryTrend = {
                name: "groceries",
                periods: [
                    {
                        sum: 121.55,
                        period: "2021.07",
                        transactions: [
                            {
                                day: 7,
                                month: 7,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose:
                                    "VISA 23 GROCERIE LAND TES71234123423134",
                                value: 109.56,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                            {
                                day: 7,
                                month: 7,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose:
                                    "VISA 23 GROCERIE LAND TES71234123423134",
                                value: 11.99,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                        ],
                    },
                    {
                        sum: 88.86,
                        period: "2021.08",
                        transactions: [
                            {
                                day: 11,
                                month: 8,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose:
                                    "VISA 11 GROCERIE LAND TES71234123423134",
                                value: 88.86,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                        ],
                    },
                    {
                        sum: 320.59,
                        period: "2021.09",
                        transactions: [
                            {
                                day: 7,
                                month: 9,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose: "VISA 34 GROCERIE LAND TES7123123",
                                value: 111.96,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                            {
                                day: 16,
                                month: 9,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose: "VISA 34 GROCERIE LAND TES7123123",
                                value: 88.77,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                            {
                                day: 24,
                                month: 9,
                                year: 2021,
                                initiator: "Grocerie Land",
                                purpose: "VISA 34 GROCERIE LAND TES7123123",
                                value: 119.86,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                        ],
                    },
                    {
                        sum: 85.93,
                        period: "2021.11",
                        transactions: [
                            {
                                day: 10,
                                month: 11,
                                year: 2021,
                                initiator: "Tasty Deli and Grocerie Store",
                                purpose: "Thanks for buying the freshest food",
                                value: 65.49,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                            {
                                day: 10,
                                month: 11,
                                year: 2021,
                                initiator: "Tasty Deli and Grocerie Store",
                                purpose: "Thanks for buying the freshest food",
                                value: 20.44,
                                category: {
                                    name: "groceries",
                                    type: "variable",
                                },
                            },
                        ],
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
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

            const expected: CategoryTrend = {
                name: "salary",
                periods: [
                    {
                        value: 1667.99,
                        bookingDate: "28.01.2021",
                        period: "2021.01",
                        transactions: [
                            {
                                day: 28,
                                month: 1,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "26.02.2021",
                        period: "2021.02",
                        transactions: [
                            {
                                day: 26,
                                month: 2,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "29.03.2021",
                        period: "2021.03",
                        transactions: [
                            {
                                day: 29,
                                month: 3,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "28.04.2021",
                        period: "2021.04",
                        transactions: [
                            {
                                day: 28,
                                month: 4,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "27.05.2021",
                        period: "2021.05",
                        transactions: [
                            {
                                day: 27,
                                month: 5,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "28.06.2021",
                        period: "2021.06",
                        transactions: [
                            {
                                day: 28,
                                month: 6,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "29.07.2021",
                        period: "2021.07",
                        transactions: [
                            {
                                day: 29,
                                month: 7,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "27.08.2021",
                        period: "2021.08",
                        transactions: [
                            {
                                day: 27,
                                month: 8,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "28.09.2021",
                        period: "2021.09",
                        transactions: [
                            {
                                day: 28,
                                month: 9,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1667.99,
                        bookingDate: "28.10.2021",
                        period: "2021.10",
                        transactions: [
                            {
                                day: 28,
                                month: 10,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1667.99,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1822.37,
                        bookingDate: "29.11.2021",
                        period: "2021.11",
                        transactions: [
                            {
                                day: 29,
                                month: 11,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1822.37,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                    {
                        value: 1822.37,
                        bookingDate: "28.12.2021",
                        period: "2021.12",
                        transactions: [
                            {
                                day: 28,
                                month: 12,
                                year: 2021,
                                initiator: "Owl Logistic Corp.",
                                purpose: "Have fun",
                                value: 1822.37,
                                category: {
                                    name: "salary",
                                    type: "income",
                                },
                            },
                        ],
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
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
            const expected: CategoryTrend = {
                name: "home",
                periods: [
                    {
                        sum: 2899.98,
                        period: "2021.10",
                        transactions: [
                            {
                                day: 25,
                                month: 10,
                                year: 2021,
                                initiator: "Kitchen Shop 24/7",
                                purpose:
                                    "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
                                value: 2899.98,
                                category: {
                                    name: "home",
                                    type: "special",
                                },
                            },
                        ],
                    },
                ],
            };
            expect(result).toStrictEqual(expected);
        });
    });
});

// -- test list
// generate trend for fixed type
// generate trend for income type
// generate trend for variable type
// generate trend for special type
// generarte a trend report for every transaction type
// weekly reports
// yearly reports
