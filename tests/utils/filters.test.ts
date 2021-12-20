import {
    filterDoubleTransactions,
    filterTransactions,
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

    describe("Test function filterTransactions", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                expect(
                    filterTransactions([], {
                        samples: [{ initiator: "test" }],
                        before: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if samples option is empty", () => {
                expect(
                    filterTransactions(transactions, {
                        samples: [],
                        before: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if there aren't any transactions that match 'before date' option", () => {
                expect(
                    filterTransactions(transactions, {
                        samples: [{ initiator: "Rent for my crib" }],
                        before: "15.12.1999",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if 'before date' is after 'after date' option", () => {
                expect(
                    filterTransactions(transactions, {
                        samples: [{ initiator: "Rent for my crib" }],
                        before: "15.12.1999",
                        after: "12.07.2002",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if no transaction is matching", () => {
                expect(
                    filterTransactions(transactions, {
                        samples: [{ initiator: "Wizard from Oz" }],
                        before: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });
        });

        describe("Test filtering transactions by exactly one sample", () => {
            const samples = [{ initiator: "Rent for my crib" }];

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
                        month: 9,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
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
                        day: 1,
                        month: 10,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
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
                        day: 1,
                        month: 7,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                    before: "30.11.2021",
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from 'before date' to 'after date'", () => {
                const expected = [
                    {
                        day: 1,
                        month: 9,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
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
                        month: 11,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                    before: "15.11.2021",
                    after: "31.08.2021",
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions without date limitation", () => {
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
                        month: 9,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
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
                        day: 1,
                        month: 10,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
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
                        day: 1,
                        month: 7,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                    {
                        day: 1,
                        month: 12,
                        year: 2021,
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: 650,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });
        });

        describe("Test filtering transactions by multiple samples", () => {
            const samples = [
                { initiator: "Beef Burger Palace" },
                { initiator: "Almost Healthy Inc." },
                { initiator: "Grocerie Land" },
            ];

            test("Filter transactions until specific to date", () => {
                const expected = [
                    {
                        day: 1,
                        month: 6,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
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
                        day: 1,
                        month: 7,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
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
                        day: 7,
                        month: 7,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                        value: 109.56,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                    before: "01.10.2021",
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from specific to date to specific since date", () => {
                const expected = [
                    {
                        day: 2,
                        month: 8,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
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
                        day: 7,
                        month: 7,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                        value: 109.56,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                    before: "01.10.2021",
                    after: "05.07.2021",
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions without date limitation", () => {
                const expected = [
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
                        month: 6,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
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
                        day: 1,
                        month: 7,
                        year: 2021,
                        initiator: "Almost Healthy Inc.",
                        purpose: "We bet that you're going to be sick",
                        value: 12.99,
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
                        day: 7,
                        month: 7,
                        year: 2021,
                        initiator: "Grocerie Land",
                        purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                        value: 109.56,
                    },
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples,
                });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Match samples that only differ in purpose", () => {
                const expected = [
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
                        day: 15,
                        month: 9,
                        year: 2021,
                        initiator: "Online Payments Group",
                        purpose: "Music Whale",
                        value: 9.99,
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
                ];

                const filteredTransactions = filterTransactions(transactions, {
                    samples: [
                        {
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                        },
                    ],
                });
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
});
