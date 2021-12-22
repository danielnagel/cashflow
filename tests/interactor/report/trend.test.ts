import { generateCategoryTrendPeriod } from "../../../src/interactor/report/trend";
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
});

// generate trend for a category of fixed type
// generate trend for fixed type
// generate trend for a category of income type
// generate trend for income type
// generate trend for a category of variable type
// generate trend for variable type
// generate trend for a category of special type
// generate trend for special type
// generarte a trend report for every transaction type
