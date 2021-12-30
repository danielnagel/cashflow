import {
    generateFixedPayDay,
    generateFixedPayDayReport,
} from "../../../src/interactor/report/fixedPayDay";
import { TransactionType } from "../../../src/types/enums";
import { categorizedTransactions } from "./samples/categorizedTransactions";

describe("Test fixCostReport", () => {
    describe("Test function generateFixedPayDay", () => {
        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
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
                    day: 19,
                    month: 10,
                    year: 2021,
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 23.65,
                },
            ];

            test("Return null, category doesn't match", () => {
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

            test("Return null, if there aren't any transactions that match toDate", () => {
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

            test("Return null, if sinceDate is after toDate", () => {
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
        });

        describe("Test fixed pay days to match exactly one interactor (sample), same booking day, unsorted transactions", () => {
            test("Generate fix cost as expected", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaid: true,
                    lastBookingDays: [1, 1, 1, 1, 1, 1],
                    averageBookingDay: 1,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 1,
                            month: 8,
                            year: 2021,
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
                            day: 1,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 11,
                            year: 2021,
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
                    lastBookingDays: [1, 1, 1, 1, 1],
                    averageBookingDay: 1,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 1,
                            month: 8,
                            year: 2021,
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
                            day: 1,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                    lastBookingDays: [1, 1],
                    averageBookingDay: 1,
                    transactions: [
                        {
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 11,
                            year: 2021,
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
                    lastBookingDays: [1, 1, 2, 3, 1, 2, 3],
                    averageBookingDay: 1,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 2,
                            month: 8,
                            year: 2021,
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
                            day: 3,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                            day: 3,
                            month: 12,
                            year: 2021,
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
                    lastBookingDays: [1, 1, 2],
                    averageBookingDay: 1,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 2,
                            month: 8,
                            year: 2021,
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
                    lastBookingDays: [3, 1, 2],
                    averageBookingDay: 2,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                    lastBookingDays: [1, 1, 2, 3, 1, 2, 3],
                    averageBookingDay: 1,
                    transactions: [
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
                                period: "monthly",
                            },
                        },
                        {
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 2,
                            month: 8,
                            year: 2021,
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
                            day: 3,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                            day: 3,
                            month: 12,
                            year: 2021,
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
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Match samples that only differ in purpose", () => {
                const expected: FixedPayDay = {
                    value: 9.99,
                    isPaid: false,
                    lastBookingDays: [15, 15, 15, 15, 15],
                    averageBookingDay: 15,
                    transactions: [
                        {
                            day: 15,
                            month: 7,
                            year: 2021,
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
                            day: 15,
                            month: 8,
                            year: 2021,
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
                            day: 15,
                            month: 9,
                            year: 2021,
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
                            day: 15,
                            month: 10,
                            year: 2021,
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
                            day: 15,
                            month: 11,
                            year: 2021,
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
        });

        describe("Test fixed pay day generation with non-monthly periods", () => {
            test("Fixed pay day generation for yearly periods", () => {
                const expected: FixedPayDay = {
                    value: 83.3325,
                    isPaid: true,
                    lastBookingDays: [13],
                    averageBookingDay: 13,
                    transactions: [
                        {
                            day: 13,
                            month: 1,
                            year: 2021,
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
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Fixed pay day generation for quarter-yearly periods", () => {
                const expected: FixedPayDay = {
                    value: 18.8,
                    isPaid: true,
                    lastBookingDays: [1, 1, 1, 1],
                    averageBookingDay: 1,
                    transactions: [
                        {
                            day: 1,
                            month: 1,
                            year: 2021,
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
                            day: 1,
                            month: 4,
                            year: 2021,
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
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                    date: "15.11.2021",
                    sum: 704.98,
                    unpaidSum: 39.99,
                    namedFixedPayDays: [
                        {
                            name: "rent",
                            fixedPayDay: {
                                value: 650,
                                isPaid: true,
                                lastBookingDays: [1, 1],
                                averageBookingDay: 1,
                                transactions: [
                                    {
                                        day: 1,
                                        month: 10,
                                        year: 2021,
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
                                        day: 1,
                                        month: 11,
                                        year: 2021,
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
                                lastBookingDays: [3, 1, 2],
                                averageBookingDay: 2,
                                transactions: [
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
                                            period: "monthly",
                                        },
                                    },
                                    {
                                        day: 1,
                                        month: 10,
                                        year: 2021,
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
                                        day: 2,
                                        month: 11,
                                        year: 2021,
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
                                lastBookingDays: [22, 22],
                                averageBookingDay: 22,
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
