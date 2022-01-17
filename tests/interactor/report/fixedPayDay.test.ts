import {
    generateFixedPayDay,
    generateFixedPayDayReport,
} from "../../../src/interactor/report/fixedPayDay";
import { TransactionType } from "../../../src/types/enums";
import { categorizedTransactions } from "./samples/categorizedTransactions";

describe("Test fixCostReport", () => {
    describe("Test function generateFixedPayDay", () => {
        describe("Test falsy parameters", () => {
            test("Return ApplicationError, if transactions array is empty", () => {
                const fixedPayDay = generateFixedPayDay([], "test", {
                    source: { type: "api" },
                    categories: [],
                    endDate: "15.12.2021",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "There are no transactions.",
                });
            });

            const transactions: Transaction[] = [
                {
                    date: new Date(2021, 9, 19),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 23.65,
                },
            ];

            test("Return ApplicationError, category doesn't match", () => {
                const fixedPayDay = generateFixedPayDay(transactions, "test", {
                    source: { type: "api" },
                    categories: [],
                    endDate: "15.12.2021",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });

            test("Return ApplicationError, if there aren't any transactions that match toDate", () => {
                const fixedPayDay = generateFixedPayDay(transactions, "rent", {
                    source: { type: "api" },
                    categories: [],
                    endDate: "15.12.2021",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });

            test("Return ApplicationError, if startDate is after endDate", () => {
                const fixedPayDay = generateFixedPayDay(transactions, "rent", {
                    source: { type: "api" },
                    categories: [],
                    endDate: "15.12.2021",
                    startDate: "30.12.2021",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });

            test("Return ApplicationError, if endDate has wrong format", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15122021",
                    },
                );

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message:
                        "Before date filter options can't be parse! Before date is '15122021'",
                });
            });
        });

        describe("Test fixed pay days to match exactly one interactor (sample), same booking day, unsorted transactions", () => {
            test("Generate fix cost as expected", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.10.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        startDate: "01.09.2021",
                        endDate: "15.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });
        });

        describe("Test fixed pay days to match multiple interactors (samples), which are the same fix cost, but the interactor name changes; different booking days", () => {
            test("Generate fix cost as expected", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 2),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 8, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 2),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 11, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixedPayDay = {
                    value: 12.99,
                    isPaid: false,
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 2),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "01.09.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 8, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 2),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        startDate: "01.09.2021",
                        endDate: "15.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, without specified Date", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 2),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 8, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 2),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 11, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Match samples that only differ in purpose", () => {
                const expected: FixedPayDay = {
                    value: 9.99,
                    isPaid: false,
                    transactions: [
                        {
                            date: new Date(2021, 6, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 7, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 8, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 9, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                        {
                            date: new Date(2021, 10, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "music subscription",
                    {
                        source: { type: "api" },
                        categories: [],
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Match categories without periods", () => {
                const expected: FixedPayDay = {
                    value: 19.99,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 7, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                        {
                            date: new Date(2021, 8, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                        {
                            date: new Date(2021, 9, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                        {
                            date: new Date(2021, 10, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "gaming subscription",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });
        });

        describe("Test fixed pay day generation with non-monthly periods", () => {
            test("Fixed pay day generation for yearly periods", () => {
                const expected: FixedPayDay = {
                    value: 83.3325,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 0, 13),
                            initiator: "Car Insurance Corp.",
                            purpose: "Safety first!",
                            value: 999.99,
                            category: {
                                name: "car insurance",
                                type: "fixed",
                                period: "yearly",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "car insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Fixed pay day generation for quarter-yearly periods", () => {
                const expected: FixedPayDay = {
                    value: 18.8,
                    isPaid: true,
                    transactions: [
                        {
                            date: new Date(2021, 0, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                        {
                            date: new Date(2021, 3, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                };

                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "luxury",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });
        });
    });

    describe("Test categorized fixed pay days", () => {
        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
                expect(
                    generateFixedPayDayReport([], {
                        source: { type: "api" },
                        categories: [
                            {
                                name: "a",
                                type: "",
                                samples: [
                                    { initiator: "b" },
                                    { initiator: "c" },
                                ],
                            },
                        ],
                        allowedLogLevel: "none",
                    }),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "There are no transactions.",
                });
            });

            test("Return null, if categories array is empty", () => {
                expect(
                    generateFixedPayDayReport(categorizedTransactions, {
                        source: { type: "api" },
                        categories: [],
                        allowedLogLevel: "none",
                    }),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "Couldn't match any categories.",
                });
            });

            test("Return null, if no transaction can be categorized", () => {
                expect(
                    generateFixedPayDayReport(categorizedTransactions, {
                        source: { type: "api" },
                        categories: [
                            {
                                name: "a",
                                type: "",
                                samples: [
                                    { initiator: "b" },
                                    { initiator: "c" },
                                ],
                            },
                        ],
                        allowedLogLevel: "none",
                    }),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "Couldn't match any categories.",
                });
            });
        });

        describe("Test categorized fixed pay days to match multiple categories to a specific date", () => {
            test("Generate categorized fixed pay days as expected", () => {
                const expected: CategorizedFixedPayDays = {
                    sum: 704.98,
                    unpaidSum: 39.99,
                    namedFixedPayDays: [
                        {
                            name: "rent",
                            fixedPayDay: {
                                value: 650,
                                isPaid: true,
                                transactions: [
                                    {
                                        date: new Date(2021, 9, 1),
                                        initiator: "Rent for my crib",
                                        purpose: "Thanks landlord",
                                        value: 650,
                                        category: {
                                            name: "rent",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                    {
                                        date: new Date(2021, 10, 1),
                                        initiator: "Rent for my crib",
                                        purpose: "Thanks landlord",
                                        value: 650,
                                        category: {
                                            name: "rent",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: "insurance",
                            fixedPayDay: {
                                value: 14.99,
                                isPaid: true,
                                transactions: [
                                    {
                                        date: new Date(2021, 8, 3),
                                        initiator: "Stay Healthy Corp.",
                                        purpose: "Your health is our mission",
                                        value: 14.99,
                                        category: {
                                            name: "insurance",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                    {
                                        date: new Date(2021, 9, 1),
                                        initiator: "Stay Healthy Corp.",
                                        purpose: "Your health is our mission",
                                        value: 14.99,
                                        category: {
                                            name: "insurance",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                    {
                                        date: new Date(2021, 10, 2),
                                        initiator: "Stay Healthy Corp.",
                                        purpose: "Your health is our mission",
                                        value: 14.99,
                                        category: {
                                            name: "insurance",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: "mobile",
                            fixedPayDay: {
                                value: 39.99,
                                isPaid: false,
                                transactions: [
                                    {
                                        date: new Date(2021, 8, 22),
                                        initiator: "Mobilio Ltd.",
                                        purpose: "your mobile phone provider",
                                        value: 39.99,
                                        category: {
                                            name: "mobile",
                                            type: "fixed",
                                            period: "monthly",
                                        },
                                    },
                                    {
                                        date: new Date(2021, 9, 22),
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
                        },
                    ],
                };

                expect(
                    generateFixedPayDayReport(categorizedTransactions, {
                        source: { type: "api" },
                        categories: [
                            {
                                name: "rent",
                                type: TransactionType.Fixed,
                                samples: [{ initiator: "Rent for my crib" }],
                            },
                            {
                                name: "insurance",
                                type: TransactionType.Fixed,
                                samples: [{ initiator: "Stay Healthy Corp." }],
                            },
                            {
                                name: "mobile",
                                type: TransactionType.Fixed,
                                samples: [{ initiator: "Mobilio Ltd." }],
                            },
                        ],
                        allowedLogLevel: "none",
                        endDate: "15.11.2021",
                        startDate: "01.09.2021",
                    }),
                ).toStrictEqual(expected);
            });
        });
    });
});
