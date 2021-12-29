import { TransactionType } from "../../src/types/enums";
import {
    filterDoubleTransactions,
    filterTransactionsByDateString,
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByPeriod,
    isTransactionMatchingSample,
} from "../../src/utils/filters";
import {
    transactions,
    transactionsA,
    transactionsB,
    categorizedTransactions,
} from "./samples/transactions";

describe("Test utils/filters", () => {
    describe("Test function filterTransactionsByDateString", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                expect(
                    filterTransactionsByDateString([], {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if there aren't any transactions that match 'before date' option", () => {
                expect(
                    filterTransactionsByDateString(transactions, {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.1999",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if 'before date' is after 'after date' option", () => {
                expect(
                    filterTransactionsByDateString(transactions, {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.1999",
                        startDate: "12.07.2002",
                    }),
                ).toHaveLength(0);
            });
        });

        describe("Test filtering transactions by exactly one sample", () => {
            test("Filter transactions until 'before date' ", () => {
                const expected = [
                    {
                        day: 1,
                        month: 6,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                    {
                        day: 1,
                        month: 6,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
                    },
                ];

                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        endDate: "02.06.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from 'after date' ", () => {
                const expected = [
                    {
                        day: 22,
                        month: 11,
                        year: 2021,
                        initiator: "my-online-shop.com",
                        purpose:
                            "my-online-shop.com; 22.11;  TES710928476309298",
                        value: 9.99,
                    },
                    {
                        day: 1,
                        month: 12,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                    {
                        day: 3,
                        month: 12,
                        year: 2021,
                        initiator: "Stay Healthy Corp.",
                        purpose: "Your health is our mission",
                        value: 14.99,
                    },
                    {
                        day: 23,
                        month: 11,
                        year: 2021,
                        initiator: "Online Payments Group",
                        purpose: "Game Suprise Box Subscription",
                        value: 19.99,
                    },
                ];

                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        startDate: "20.11.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from 'before date' to 'after date'", () => {
                const expected = [
                    {
                        day: 22,
                        month: 11,
                        year: 2021,
                        initiator: "my-online-shop.com",
                        purpose:
                            "my-online-shop.com; 22.11;  TES710928476309298",
                        value: 9.99,
                    },
                    {
                        day: 23,
                        month: 11,
                        year: 2021,
                        initiator: "Online Payments Group",
                        purpose: "Game Suprise Box Subscription",
                        value: 19.99,
                    },
                ];

                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        report: "fixedpayday",
                        source: { type: "api" },
                        categories: [],
                        endDate: "01.12.2021",
                        startDate: "20.11.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });
        });
    });

    describe("Test function filterDoubleTransactions", () => {
        test("Filter double transaction from two transactions", () => {
            const filteredTransactions = filterDoubleTransactions(
                transactionsA,
                transactionsB,
            );
            expect(filteredTransactions).toHaveLength(transactions.length);
            expect(filteredTransactions).toStrictEqual(transactions);
        });
    });

    describe("Test filtering of categorized transactions", () => {
        describe("Test filtering of uncategorized transaction lists", () => {
            describe("Test function filterTransactionsByCategoryType", () => {
                test("Return empty array, when transactions array is uncategorized", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            transactions,
                            TransactionType.Fixed,
                        );
                    expect(filteredTransactions).toHaveLength(0);
                });
            });

            describe("Test function filterTransactionsByCategoryName", () => {
                test("Return empty array, when transactions array is uncategorized", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryName(transactions, "rent");
                    expect(filteredTransactions).toHaveLength(0);
                });
            });
        });

        describe("Test filtering of categorized transaction lists", () => {
            describe("Test function filterTransactionsByCategoryType", () => {
                test("Return filtered list by category type fixed", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            categorizedTransactions,
                            TransactionType.Fixed,
                        );
                    const expected: Transaction[] = [
                        {
                            day: 1,
                            month: 6,
                            year: 2021,
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: undefined,
                            },
                        },
                        {
                            day: 1,
                            month: 6,
                            year: 2021,
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: undefined,
                            },
                        },
                        {
                            day: 1,
                            month: 9,
                            year: 2021,
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: undefined,
                            },
                        },
                        {
                            day: 3,
                            month: 9,
                            year: 2021,
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: undefined,
                            },
                        },
                    ];
                    expect(filteredTransactions).toHaveLength(expected.length);
                    expect(filteredTransactions).toStrictEqual(expected);
                });

                test("Return filtered list by category type variable", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            categorizedTransactions,
                            TransactionType.Variable,
                        );
                    const expected: Transaction[] = [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: {
                                name: "food",
                                type: "variable",
                                period: undefined,
                            },
                        },
                        {
                            day: 1,
                            month: 9,
                            year: 2021,
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: {
                                name: "food",
                                type: "variable",
                                period: undefined,
                            },
                        },
                        {
                            day: 11,
                            month: 11,
                            year: 2021,
                            initiator: "Presentable Presents",
                            purpose: "Good luck!",
                            value: 199.78,
                            category: {
                                name: "presents",
                                type: "variable",
                                period: undefined,
                            },
                        },
                        {
                            day: 7,
                            month: 7,
                            year: 2021,
                            initiator: "Grocerie Land",
                            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                            value: 109.56,
                            category: {
                                name: "groceries",
                                type: "variable",
                                period: undefined,
                            },
                        },
                        {
                            day: 11,
                            month: 8,
                            year: 2021,
                            initiator: "Grocerie Land",
                            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                            value: 88.86,
                            category: {
                                name: "groceries",
                                type: "variable",
                                period: undefined,
                            },
                        },
                    ];
                    expect(filteredTransactions).toHaveLength(expected.length);
                    expect(filteredTransactions).toStrictEqual(expected);
                });
            });

            describe("Test function filterTransactionsByCategoryName", () => {
                test("Return filtered list by category name", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryName(
                            categorizedTransactions,
                            "food",
                        );

                    const expected: Transaction[] = [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: {
                                name: "food",
                                type: "variable",
                                period: undefined,
                            },
                        },
                        {
                            day: 1,
                            month: 9,
                            year: 2021,
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: {
                                name: "food",
                                type: "variable",
                                period: undefined,
                            },
                        },
                    ];
                    expect(filteredTransactions).toHaveLength(expected.length);
                    expect(filteredTransactions).toStrictEqual(expected);
                });
            });

            describe("Test function filterTransactionsByPeriod", () => {
                test("Return empty list if period did not match", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2019.11",
                    );
                    expect(filteredTransactions).toHaveLength(0);
                });
                test("Return empty list if period couldn't be parsed", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2021/11",
                    );
                    expect(filteredTransactions).toHaveLength(0);
                });
                const expected = [
                    {
                        day: 1,
                        month: 6,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                    {
                        day: 1,
                        month: 6,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
                    },
                    {
                        day: 13,
                        month: 6,
                        year: 2021,
                        initiator: "Tasty Deli and Grocerie Store",
                        purpose: "Thanks for buying the freshest food",
                        value: 33.97,
                    },
                    {
                        day: 30,
                        month: 6,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 34 GROCERIE LAND TES412347123234334",
                        value: 111.11,
                    },
                ];
                test("Return filtered list by period", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2021.06",
                    );

                    expect(filteredTransactions).toHaveLength(expected.length);
                    expect(filteredTransactions).toStrictEqual(expected);
                });

                test("Return filtered list by period, change date format", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "21/06",
                        "yy/MM",
                    );
                    expect(filteredTransactions).toHaveLength(expected.length);
                    expect(filteredTransactions).toStrictEqual(expected);
                });
            });
        });
    });
    describe("Test matching of samples", () => {
        test("Match transaction with exact sample", () => {
            const transaction: Transaction = {
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
            };
            const sample: Sample = { initiator: "Grocerie Land" };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeTruthy();
        });

        test("Don't match transaction with false sample", () => {
            const transaction: Transaction = {
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
            };
            const sample: Sample = { initiator: "test" };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeFalsy();
        });

        test("Matching initiators with unique purposes", () => {
            const transaction: Transaction = {
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
            };
            const sample: Sample = {
                initiator: "Grocerie Land",
                purpose: "grocerie",
            };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeTruthy();
        });

        test("Matching initiator with like match", () => {
            const transaction: Transaction = {
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
            };
            const sample: Sample = {
                initiator: "~Land",
            };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeTruthy();
        });

        test("Matching initiator explicitly without purpose", () => {
            const transaction: Transaction = {
                day: 7,
                month: 9,
                year: 2021,
                initiator: "Grocerie Land",
                purpose: "",
                value: 111.96,
                category: {
                    name: "groceries",
                    type: "variable",
                },
            };
            const sample: Sample = {
                initiator: "~Land",
                purpose: null,
            };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeTruthy();
        });

        test("Not matching initiator, which has a purpose, explicitly without purpose", () => {
            const transaction: Transaction = {
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
            };
            const sample: Sample = {
                initiator: "~Land",
                purpose: null,
            };
            expect(
                isTransactionMatchingSample(transaction, sample),
            ).toBeFalsy();
        });
    });
});
