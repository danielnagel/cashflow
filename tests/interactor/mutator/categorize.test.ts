import { categorizeTransaction } from "../../../src/interactor/mutator/categorize";

describe("Test interactor/mutator/categorize", () => {
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
            day: 7,
            month: 7,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
            value: 109.56,
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

    describe("Test function categorizeTransactions", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                const options: SampledCategory[] = [
                    {
                        name: "a",
                        type: "",
                        samples: [{ initiator: "b" }, { initiator: "c" }],
                    },
                ];
                expect(categorizeTransaction([], options)).toHaveLength(0);
            });

            test("Return an array of length 0, if no transaction is matching", () => {
                const options: SampledCategory[] = [
                    {
                        name: "a",
                        type: "",
                        samples: [{ initiator: "b" }, { initiator: "c" }],
                    },
                ];
                const categorizedTransactions = categorizeTransaction(
                    transactions,
                    options,
                );
                const expected: ApplicationError = {
                    source: "categorize.ts",
                    message: `Couldn't match any transaction.`,
                };
                expect(categorizedTransactions).toStrictEqual(expected);
            });
        });

        describe("Test categorizing transactions", () => {
            test("Categorize transactions", () => {
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
                            period: undefined,
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
                            period: undefined,
                        },
                    },
                    {
                        day: 19,
                        month: 10,
                        year: 2021,
                        initiator: "my-online-shop.com",
                        purpose:
                            "my-online-shop.com; 19.10; TES710928476309298",
                        value: 23.65,
                        category: {
                            name: "shopping",
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
                        day: 21,
                        month: 9,
                        year: 2021,
                        initiator: "my-online-shop.com",
                        purpose:
                            "my-online-shop.com; 21.09;  TES710928476309298",
                        value: 44.86,
                        category: {
                            name: "shopping",
                            type: "variable",
                            period: undefined,
                        },
                    },
                    {
                        day: 22,
                        month: 11,
                        year: 2021,
                        initiator: "my-online-shop.com",
                        purpose:
                            "my-online-shop.com; 22.11;  TES710928476309298",
                        value: 9.99,
                        category: {
                            name: "shopping",
                            type: "variable",
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
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
                            period: undefined,
                        },
                    },
                ];

                const options: SampledCategory[] = [
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
                ];

                const categorizedTransactions = categorizeTransaction(
                    transactions,
                    options,
                );
                expect(categorizedTransactions).toHaveLength(expected.length);
                expect(categorizedTransactions).toStrictEqual(expected);
            });

            test("Return ApplicationError if not all transactions could be categorized", () => {
                const options: SampledCategory[] = [
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
                ];

                const categorizedTransactions = categorizeTransaction(
                    transactions,
                    options,
                );
                const expected: ApplicationError = {
                    source: "categorize.ts",
                    message: `Couldn't match all transactions. Unmatched Transactions: "Beef Burger Palace", "Melon the Man", "Presentable Presents".`,
                };
                expect(categorizedTransactions).toStrictEqual(expected);
            });
        });
    });
});
