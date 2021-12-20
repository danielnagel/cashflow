import { CategoryType } from "../../src/types/enums";
import {
    filterDoubleTransactions,
    filterTransactionsByDate,
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
} from "../../src/utils/filters";

describe("Test utils/filters", () => {
    const transactions: Transaction[] = [
        {
            day: 19,
            month: 10,
            year: 2021,
            initiator: "Beef Burger Palace",
            purpose: "We hope that you had a beefy good time!",
            value: 49.55,
        },
        {
            day: 1,
            month: 9,
            year: 2021,
            initiator: "Melon the Man",
            purpose: "Juicy Melons",
            value: 39.38,
        },
        {
            day: 11,
            month: 11,
            year: 2021,
            initiator: "Presentable Presents",
            purpose: "Good luck!",
            value: 199.78,
        },
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
            day: 1,
            month: 9,
            year: 2021,
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: 650,
        },
        {
            day: 3,
            month: 9,
            year: 2021,
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: 14.99,
        },
        {
            day: 11,
            month: 8,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
            value: 88.86,
        },
        {
            day: 1,
            month: 8,
            year: 2021,
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: 650,
        },
        {
            day: 2,
            month: 8,
            year: 2021,
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: 12.99,
        },
        {
            day: 19,
            month: 10,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 19.10; TES710928476309298",
            value: 23.65,
        },
        {
            day: 7,
            month: 7,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
            value: 109.56,
        },
        {
            day: 21,
            month: 9,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 21.09;  TES710928476309298",
            value: 44.86,
        },
        {
            day: 22,
            month: 11,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 22.11;  TES710928476309298",
            value: 9.99,
        },
        {
            day: 1,
            month: 10,
            year: 2021,
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: 650,
        },
        {
            day: 1,
            month: 10,
            year: 2021,
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: 14.99,
        },
        {
            day: 10,
            month: 11,
            year: 2021,
            initiator: "Tasty Deli and Grocerie Store",
            purpose: "Thanks for buying the freshest food",
            value: 65.49,
        },
        {
            day: 1,
            month: 11,
            year: 2021,
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: 650,
        },
        {
            day: 2,
            month: 11,
            year: 2021,
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: 14.99,
        },
        {
            day: 1,
            month: 7,
            year: 2021,
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: 650,
        },
        {
            day: 1,
            month: 7,
            year: 2021,
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: 12.99,
        },
        {
            day: 10,
            month: 11,
            year: 2021,
            initiator: "Tasty Deli and Grocerie Store",
            purpose: "Thanks for buying the freshest food",
            value: 65.49,
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
            day: 15,
            month: 7,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Music Whale",
            value: 9.99,
        },
        {
            day: 15,
            month: 8,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Music Whale",
            value: 9.99,
        },
        {
            day: 23,
            month: 8,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
        },
        {
            day: 15,
            month: 9,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Music Whale",
            value: 9.99,
        },
        {
            day: 23,
            month: 9,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
        },
        {
            day: 15,
            month: 10,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Music Whale",
            value: 9.99,
        },
        {
            day: 15,
            month: 11,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Music Whale",
            value: 9.99,
        },
        {
            day: 23,
            month: 10,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
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

    describe("Test function filterTransactionsByDate", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                expect(
                    filterTransactionsByDate([], {
                        before: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if there aren't any transactions that match 'before date' option", () => {
                expect(
                    filterTransactionsByDate(transactions, {
                        before: "15.12.1999",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if 'before date' is after 'after date' option", () => {
                expect(
                    filterTransactionsByDate(transactions, {
                        before: "15.12.1999",
                        after: "12.07.2002",
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

                const filteredTransactions = filterTransactionsByDate(
                    transactions,
                    {
                        before: "02.06.2021",
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

                const filteredTransactions = filterTransactionsByDate(
                    transactions,
                    {
                        after: "20.11.2021",
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

                const filteredTransactions = filterTransactionsByDate(
                    transactions,
                    {
                        before: "01.12.2021",
                        after: "20.11.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });
        });
    });

    describe("Test function filterDoubleTransactions", () => {
        const transactionsA: Transaction[] = [
            {
                day: 19,
                month: 10,
                year: 2021,
                initiator: "Beef Burger Palace",
                purpose: "We hope that you had a beefy good time!",
                value: 49.55,
            },
            {
                day: 1,
                month: 9,
                year: 2021,
                initiator: "Melon the Man",
                purpose: "Juicy Melons",
                value: 39.38,
            },
            {
                day: 11,
                month: 11,
                year: 2021,
                initiator: "Presentable Presents",
                purpose: "Good luck!",
                value: 199.78,
            },
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
                day: 1,
                month: 9,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 3,
                month: 9,
                year: 2021,
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                day: 11,
                month: 8,
                year: 2021,
                initiator: "Grocerie Land",
                purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                value: 88.86,
            },
        ];

        const transactionsB: Transaction[] = [
            {
                day: 1,
                month: 6,
                year: 2021,
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                day: 1,
                month: 9,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 3,
                month: 9,
                year: 2021,
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                day: 11,
                month: 8,
                year: 2021,
                initiator: "Grocerie Land",
                purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                value: 88.86,
            },
            {
                day: 1,
                month: 8,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 2,
                month: 8,
                year: 2021,
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                day: 19,
                month: 10,
                year: 2021,
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 19.10; TES710928476309298",
                value: 23.65,
            },
            {
                day: 7,
                month: 7,
                year: 2021,
                initiator: "Grocerie Land",
                purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                value: 109.56,
            },
            {
                day: 21,
                month: 9,
                year: 2021,
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 21.09;  TES710928476309298",
                value: 44.86,
            },
            {
                day: 22,
                month: 11,
                year: 2021,
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 22.11;  TES710928476309298",
                value: 9.99,
            },
            {
                day: 1,
                month: 10,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 1,
                month: 10,
                year: 2021,
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                day: 10,
                month: 11,
                year: 2021,
                initiator: "Tasty Deli and Grocerie Store",
                purpose: "Thanks for buying the freshest food",
                value: 65.49,
            },
            {
                day: 1,
                month: 11,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 2,
                month: 11,
                year: 2021,
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                day: 1,
                month: 7,
                year: 2021,
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                day: 1,
                month: 7,
                year: 2021,
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                day: 10,
                month: 11,
                year: 2021,
                initiator: "Tasty Deli and Grocerie Store",
                purpose: "Thanks for buying the freshest food",
                value: 65.49,
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
                day: 15,
                month: 7,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Music Whale",
                value: 9.99,
            },
            {
                day: 15,
                month: 8,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Music Whale",
                value: 9.99,
            },
            {
                day: 23,
                month: 8,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Game Suprise Box Subscription",
                value: 19.99,
            },
            {
                day: 15,
                month: 9,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Music Whale",
                value: 9.99,
            },
            {
                day: 23,
                month: 9,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Game Suprise Box Subscription",
                value: 19.99,
            },
            {
                day: 15,
                month: 10,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Music Whale",
                value: 9.99,
            },
            {
                day: 15,
                month: 11,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Music Whale",
                value: 9.99,
            },
            {
                day: 23,
                month: 10,
                year: 2021,
                initiator: "Online Payments Group",
                purpose: "Game Suprise Box Subscription",
                value: 19.99,
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
                            CategoryType.Fixed,
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
            const categorizedTransactions: Transaction[] = [
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
            describe("Test function filterTransactionsByCategoryType", () => {
                test("Return filtered list by category type fixed", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            categorizedTransactions,
                            CategoryType.Fixed,
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
                            CategoryType.Variable,
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
        });
    });
});
