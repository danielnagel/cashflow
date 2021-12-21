import {
    generateFixedPayDay,
    generateFixedPayDayReport,
} from "../../../src/interactor/report/fixedPaxDay";
import { CategoryType } from "../../../src/types/enums";

describe("Test fixCostReport", () => {
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
                period: "monthly",
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
                period: "monthly",
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
            day: 11,
            month: 8,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
            value: 88.86,
            category: {
                name: "groceries",
                type: "variable",
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
        {
            day: 19,
            month: 10,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 19.10; TES710928476309298",
            value: 23.65,
            category: {
                name: "shopping",
                type: "variable",
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
            },
        },
        {
            day: 21,
            month: 9,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 21.09;  TES710928476309298",
            value: 44.86,
            category: {
                name: "shopping",
                type: "variable",
            },
        },
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
            month: 11,
            year: 2021,
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com; 22.11;  TES710928476309298",
            value: 9.99,
            category: {
                name: "shopping",
                type: "variable",
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
            day: 1,
            month: 12,
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
            day: 23,
            month: 8,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
            category: {
                name: "gaming subscription",
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
            day: 23,
            month: 9,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
            category: {
                name: "gaming subscription",
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
        {
            day: 23,
            month: 10,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
            category: {
                name: "gaming subscription",
                type: "fixed",
                period: "monthly",
            },
        },
        {
            day: 23,
            month: 11,
            year: 2021,
            initiator: "Online Payments Group",
            purpose: "Game Suprise Box Subscription",
            value: 19.99,
            category: {
                name: "gaming subscription",
                type: "fixed",
                period: "monthly",
            },
        },
        {
            day: 22,
            month: 11,
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
    ];

    describe("Test function generateFixedPayDay", () => {
        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
                const fixedPayDay = generateFixedPayDay([], {
                    category: {
                        name: "test",
                        type: CategoryType.Fixed,
                    },
                    before: "15.12.2021",
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
                const fixedPayDay = generateFixedPayDay(transactions, {
                    category: {
                        name: "test",
                        type: CategoryType.Fixed,
                    },
                    before: "15.12.2021",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });

            test("Return null, if there aren't any transactions that match toDate", () => {
                const fixedPayDay = generateFixedPayDay(transactions, {
                    category: {
                        name: "rent",
                        type: CategoryType.Fixed,
                    },
                    before: "15.12.1999",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });

            test("Return null, if sinceDate is after toDate", () => {
                const fixedPayDay = generateFixedPayDay(transactions, {
                    category: {
                        name: "rent",
                        type: CategoryType.Fixed,
                    },
                    before: "15.12.1999",
                    after: "12.07.2002",
                });

                expect(fixedPayDay).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "No transactions matched by filter.",
                });
            });
        });

        describe("Test fix costs to match exactly one interactor (sample), same booking day, unsorted transactions", () => {
            test("Generate fix cost as expected", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "rent",
                            type: CategoryType.Fixed,
                        },
                        before: "30.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "rent",
                            type: CategoryType.Fixed,
                        },
                        before: "15.10.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixedPayDay = {
                    value: 650,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "rent",
                            type: CategoryType.Fixed,
                        },
                        before: "15.11.2021",
                        after: "01.09.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });
        });

        describe("Test fix costs to match multiple interactors (samples), which are the same fix cost, but the interactor name changes; different booking days", () => {
            test("Generate fix cost as expected", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "insurance",
                            type: CategoryType.Fixed,
                        },
                        before: "30.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixedPayDay = {
                    value: 12.99,
                    isPaidThisMonth: false,
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
                    {
                        category: {
                            name: "insurance",
                            type: CategoryType.Fixed,
                        },
                        before: "01.09.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "insurance",
                            type: CategoryType.Fixed,
                        },
                        before: "15.11.2021",
                        after: "01.09.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, without specified Date", () => {
                const expected: FixedPayDay = {
                    value: 14.99,
                    isPaidThisMonth: true,
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
                    {
                        category: {
                            name: "insurance",
                            type: CategoryType.Fixed,
                        },
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });

            test("Match samples that only differ in purpose", () => {
                const expected: FixedPayDay = {
                    value: 9.99,
                    isPaidThisMonth: false,
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
                    {
                        category: {
                            name: "music subscription",
                            type: CategoryType.Fixed,
                        },
                    },
                );

                expect(fixedPayDay).toStrictEqual(expected);
            });
        });
    });

    describe("Test categorized fix costs", () => {
        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
                const fixCostOptions = {};
                const categorizeOptions = {
                    categories: [
                        {
                            name: "a",
                            type: "",
                            samples: [{ initiator: "b" }, { initiator: "c" }],
                        },
                    ],
                };
                expect(
                    generateFixedPayDayReport(
                        [],
                        fixCostOptions,
                        categorizeOptions,
                        {
                            allowedLogLevel: "none",
                        },
                    ),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "There are no transactions.",
                });
            });

            test("Return null, if categories array is empty", () => {
                const fixCostOptions = {};
                const categorizeOptions = {
                    categories: [],
                };
                const options: CategorizeOptions = { categories: [] };
                expect(
                    generateFixedPayDayReport(
                        categorizedTransactions,
                        fixCostOptions,
                        categorizeOptions,
                        {
                            allowedLogLevel: "none",
                        },
                    ),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "Couldn't match any categories.",
                });
            });

            test("Return null, if no transaction can be categorized", () => {
                const fixCostOptions = {};
                const categorizeOptions = {
                    categories: [
                        {
                            name: "a",
                            type: "",
                            samples: [{ initiator: "b" }, { initiator: "c" }],
                        },
                    ],
                };
                expect(
                    generateFixedPayDayReport(
                        categorizedTransactions,
                        fixCostOptions,
                        categorizeOptions,
                        {
                            allowedLogLevel: "none",
                        },
                    ),
                ).toStrictEqual({
                    source: "fixedPayDay.ts",
                    message: "Couldn't match any categories.",
                });
            });
        });

        describe("Test categorized fix costs to match multiple categories to a specific date", () => {
            test("Generate categorized fix costs as expected", () => {
                const expected: CategorizedFixedPayDays = {
                    date: "15.11.2021",
                    sum: 704.98,
                    unpaidSum: 39.99,
                    namedFixedPayDays: [
                        {
                            name: "rent",
                            fixedPayDay: {
                                value: 650,
                                isPaidThisMonth: true,
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
                                isPaidThisMonth: true,
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
                                isPaidThisMonth: false,
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

                const fixCostOptions = {
                    before: "15.11.2021",
                    after: "01.09.2021",
                };
                const categorizeOptions = {
                    categories: [
                        {
                            name: "rent",
                            type: CategoryType.Fixed,
                            samples: [{ initiator: "Rent for my crib" }],
                        },
                        {
                            name: "insurance",
                            type: CategoryType.Fixed,
                            samples: [{ initiator: "Stay Healthy Corp." }],
                        },
                        {
                            name: "mobile",
                            type: CategoryType.Fixed,
                            samples: [{ initiator: "Mobilio Ltd." }],
                        },
                    ],
                };

                expect(
                    generateFixedPayDayReport(
                        categorizedTransactions,
                        fixCostOptions,
                        categorizeOptions,
                        {
                            allowedLogLevel: "none",
                        },
                    ),
                ).toStrictEqual(expected);
            });
        });
    });
});

// -- test list
// special handling for non-monthly, e.g. quarter yearly or yearly fix costs
