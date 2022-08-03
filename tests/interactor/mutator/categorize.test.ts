import { categorizeTransaction } from "../../../src/interactor/mutator/categorize";
import { transactions } from "./samples/transactions";
import {
    categorizedTransactions,
    categorizedTransactionsAllUnmatched,
    categorizedTransactionsWithUnmatchedTransactionCategory,
} from "./samples/categorizedTransactions";

describe.only("Test interactor/mutator/categorize", () => {
    describe("Test function categorizeTransactions", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                const options: Configuration = {
                    source: { type: "api" },
                    categories: [
                        {
                            name: "a",
                            type: "",
                            samples: [{ initiator: "b" }, { initiator: "c" }],
                        },
                    ],
                };
                expect(categorizeTransaction([], options, 0)).toHaveLength(0);
            });

            test("Return an ApplicationError, if no transaction is matching and option strict is true", () => {
                const options: Configuration = {
                    source: { type: "api" },
                    strict: true,
                    categories: [
                        {
                            name: "a",
                            type: "",
                            samples: [{ initiator: "b" }, { initiator: "c" }],
                        },
                    ],
                };
                const result = categorizeTransaction(transactions, options, 0);
                const expected: ApplicationError = {
                    source: "categorize.ts",
                    message: `Couldn't match any transaction.`,
                };
                expect(result).toStrictEqual(expected);
            });
        });

        test("Return all transactions with unmatched category, if no transaction is matching and option strict is false", () => {
            const options: Configuration = {
                source: { type: "api" },
                strict: false,
                categories: [
                    {
                        name: "a",
                        type: "",
                        samples: [{ initiator: "b" }, { initiator: "c" }],
                    },
                ],
            };
            const result = categorizeTransaction(transactions, options, 0);

            expect(result).toStrictEqual(categorizedTransactionsAllUnmatched);
        });

        describe("Test categorizing transactions", () => {
            test("Categorize transactions", () => {
                const options: Configuration = {
                    source: { type: "api" },
                    strict: false,
                    categories: [
                        {
                            name: "food",
                            type: "variable",
                            samples: [
                                { initiator: "Beef Burger Palace" },
                                { initiator: "Melon the Man" },
                            ],
                        },
                        {
                            name: "presents",
                            type: "variable",
                            samples: [{ initiator: "Presentable Presents" }],
                        },
                        {
                            name: "rent",
                            type: "fixed",
                            samples: [{ initiator: "Rent for my crib" }],
                        },
                        {
                            name: "insurance",
                            type: "fixed",
                            samples: [
                                { initiator: "Almost Healthy Inc." },
                                { initiator: "Stay Healthy Corp." },
                            ],
                        },
                        {
                            name: "groceries",
                            type: "variable",
                            samples: [
                                { initiator: "Grocerie Land" },
                                { initiator: "Tasty Deli and Grocerie Store" },
                            ],
                        },
                        {
                            name: "shopping",
                            type: "variable",
                            samples: [{ initiator: "my-online-shop.com" }],
                        },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Online Payments Group",
                                    purpose: "Music Whale",
                                },
                            ],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Online Payments Group",
                                    purpose: "Game Suprise Box Subscription",
                                },
                            ],
                        },
                        {
                            name: "furniture",
                            type: "variable",
                            samples: [
                                {
                                    initiator: "~Big Furniture Temple",
                                },
                            ],
                        },
                        {
                            name: "etfs",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Warren Buffet",
                                    purpose: "For my ETFs",
                                },
                            ],
                        },
                        {
                            name: "present for me",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Warren Buffet",
                                    purpose: null,
                                },
                            ],
                        },
                        {
                            name: "car insurance",
                            type: "fixed",
                            period: "yearly",
                            samples: [
                                {
                                    initiator: "Big Insurance Corp.",
                                },
                            ],
                        },
                        {
                            name: "tax",
                            type: "fixed",
                            period: "quarter",
                            samples: [
                                {
                                    initiator: "Taxes",
                                },
                            ],
                        },
                    ],
                };

                const result = categorizeTransaction(transactions, options, 0);
                expect(result).toHaveLength(categorizedTransactions.length);
                expect(result).toStrictEqual(categorizedTransactions);
            });

            test("Return ApplicationError if not all transactions could be categorized, strict is true", () => {
                const options: Configuration = {
                    source: { type: "api" },
                    strict: true,
                    categories: [
                        {
                            name: "rent",
                            type: "fixed",
                            samples: [{ initiator: "Rent for my crib" }],
                        },
                        {
                            name: "insurance",
                            type: "fixed",
                            samples: [
                                { initiator: "Almost Healthy Inc." },
                                { initiator: "Stay Healthy Corp." },
                            ],
                        },
                        {
                            name: "groceries",
                            type: "variable",
                            samples: [
                                { initiator: "Grocerie Land" },
                                { initiator: "Tasty Deli and Grocerie Store" },
                            ],
                        },
                        {
                            name: "shopping",
                            type: "variable",
                            samples: [{ initiator: "my-online-shop.com" }],
                        },
                        {
                            name: "music subscription",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Online Payments Group",
                                    purpose: "Music Whale",
                                },
                            ],
                        },
                        {
                            name: "gaming subscription",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Online Payments Group",
                                    purpose: "Game Suprise Box Subscription",
                                },
                            ],
                        },
                        {
                            name: "furniture",
                            type: "variable",
                            samples: [
                                {
                                    initiator: "~Big Furniture Temple",
                                },
                            ],
                        },
                        {
                            name: "etfs",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Warren Buffet",
                                    purpose: "For my ETFs",
                                },
                            ],
                        },
                        {
                            name: "present for me",
                            type: "fixed",
                            samples: [
                                {
                                    initiator: "Warren Buffet",
                                    purpose: null,
                                },
                            ],
                        },

                        {
                            name: "car insurance",
                            type: "fixed",
                            period: "yearly",
                            samples: [
                                {
                                    initiator: "Big Insurance Corp.",
                                },
                            ],
                        },
                        {
                            name: "tax",
                            type: "fixed",
                            period: "quarter",
                            samples: [
                                {
                                    initiator: "Taxes",
                                },
                            ],
                        },
                    ],
                };

                const result = categorizeTransaction(transactions, options, 0);
                const expected: ApplicationError = {
                    source: "categorize.ts",
                    message: `Couldn't match all transactions. Unmatched Transactions: "Beef Burger Palace;We hope that you had a beefy good time!", "Melon the Man;Juicy Melons", "Presentable Presents;Good luck!".`,
                };
                expect(result).toStrictEqual(expected);
            });
        });

        describe("Test categorizing unmatched transactions", () => {
            const options: Configuration = {
                source: { type: "api" },
                strict: false,
                categories: [
                    {
                        name: "rent",
                        type: "fixed",
                        samples: [{ initiator: "Rent for my crib" }],
                    },
                    {
                        name: "insurance",
                        type: "fixed",
                        samples: [
                            { initiator: "Almost Healthy Inc." },
                            { initiator: "Stay Healthy Corp." },
                        ],
                    },
                    {
                        name: "groceries",
                        type: "variable",
                        samples: [
                            { initiator: "Grocerie Land" },
                            { initiator: "Tasty Deli and Grocerie Store" },
                        ],
                    },
                    {
                        name: "shopping",
                        type: "variable",
                        samples: [{ initiator: "my-online-shop.com" }],
                    },
                    {
                        name: "music subscription",
                        type: "fixed",
                        samples: [
                            {
                                initiator: "Online Payments Group",
                                purpose: "Music Whale",
                            },
                        ],
                    },
                    {
                        name: "gaming subscription",
                        type: "fixed",
                        samples: [
                            {
                                initiator: "Online Payments Group",
                                purpose: "Game Suprise Box Subscription",
                            },
                        ],
                    },
                    {
                        name: "furniture",
                        type: "variable",
                        samples: [
                            {
                                initiator: "~Big Furniture Temple",
                            },
                        ],
                    },
                    {
                        name: "etfs",
                        type: "fixed",
                        samples: [
                            {
                                initiator: "Warren Buffet",
                                purpose: "For my ETFs",
                            },
                        ],
                    },
                    {
                        name: "present for me",
                        type: "fixed",
                        samples: [
                            {
                                initiator: "Warren Buffet",
                                purpose: null,
                            },
                        ],
                    },
                ],
            };

            const result = categorizeTransaction(transactions, options, 0);
            expect(result).toStrictEqual(
                categorizedTransactionsWithUnmatchedTransactionCategory,
            );
        });
    });
});
