import { generateReport } from "../../src/interactor/interactor";
import { TransactionType } from "../../src/types/enums";

describe("Test Interactor", () => {
    describe("Test falsy parameters", () => {
        test("Unknown connector type", async () => {
            const options: Configuration = {
                allowedLogLevel: "none",
                source: {
                    type: "unknown",
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "interactor.ts",
                message: `Unkown connector type "${options.source.type}".`,
            });
        });

        test("Unknown csv connector type, malformed object", async () => {
            const options: Configuration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "interactor.ts",
                message: `Malformed source configuration for CSV type.`,
            });
        });

        test("Unknown report type", async () => {
            const options: Configuration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [
                        "booking",
                        "valuta",
                        "initiator",
                        "bookingtext",
                        "randominformation",
                        "use",
                        "balance",
                        "currency",
                        "amount",
                        "currency",
                    ],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "unknown",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "interactor.ts",
                message: `Unkown report type "unknown".`,
            });
        });

        test("Unmatched transaction leads to error, when strict is true", async () => {
            const options: Configuration = {
                allowedLogLevel: "none",
                strict: true,
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [
                        "booking",
                        "valuta",
                        "initiator",
                        "bookingtext",
                        "randominformation",
                        "use",
                        "balance",
                        "currency",
                        "amount",
                        "currency",
                    ],
                },
                categories: [
                    {
                        name: "failingtest",
                        type: "variable",
                        samples: [{ initiator: "ishallfail" }],
                    },
                ],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "categorize.ts",
                message: `Couldn't match any transaction.`,
            });
        });

        test("Unmatched transaction leads to error, when strict is true, some transactions matching", async () => {
            const options: Configuration = {
                allowedLogLevel: "none",
                strict: true,
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [
                        "booking",
                        "valuta",
                        "initiator",
                        "bookingtext",
                        "randominformation",
                        "use",
                        "balance",
                        "currency",
                        "amount",
                        "currency",
                    ],
                },
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
                    {
                        name: "shopping",
                        type: TransactionType.Variable,
                        samples: [
                            { initiator: "my-online-shop.com" },
                            { initiator: "cool-gadgets.com" },
                        ],
                    },
                ],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "categorize.ts",
                message: `Couldn't match all transactions. Unmatched Transactions: "FOOD SHOP 1;Thanks for paying the food", "ONLINE SHOP 3;Good choice mate 2345452", "ONLINE SHOP 3;Good choice mate 2344534", "Almost Healthy Inc.;We bet that you're going to be sick", "Grocerie Land;VISA 23 GROCERIE LAND TES71234123423134", "Grocerie Land;VISA 11 GROCERIE LAND TES71234123423134", "Almost Healthy Inc.;We bet that you're going to be sick", "Grocerie Land;VISA 23 GROCERIE LAND TES71234123423134", "Tasty Deli and Grocerie Store;Thanks for buying the freshest food", "Almost Healthy Inc.;We bet that you're going to be sick", "Tasty Deli and Grocerie Store;Thanks for buying the freshest food", "Grocerie Land;VISA 11 GROCERIE LAND TES71234123423134".`,
            });
        });

        test("ApplicationError, when path to csv file doesn't exist", async () => {
            const options: CsvConfiguration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1_.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [],
                },
                categories: [
                    {
                        name: "rent",
                        type: TransactionType.Fixed,
                        samples: [{ initiator: "Rent for my crib" }],
                    },
                ],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `CSV file with transaction data not found. Path: "${options.source.path}".`,
            });
        });

        test("ApplicationError, when file doesn't end with .csv", async () => {
            const options: CsvConfiguration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.txt",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [],
                },
                categories: [
                    {
                        name: "rent",
                        type: TransactionType.Fixed,
                        samples: [{ initiator: "Rent for my crib" }],
                    },
                ],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Path needs to end with ".csv", path is "${options.source.path}"`,
            });
        });

        test("FixedPayDay ApplicationError, when there are no transactions", async () => {
            const options: CsvConfiguration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample2.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "fixedPayDay.ts",
                message: "There are no transactions.",
            });
        });

        test("Trend ApplicationError, when there are no transactions", async () => {
            const options: CsvConfiguration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample2.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "trend",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual({
                source: "trend.ts",
                message: "There are no transactions.",
            });
        });
    });

    describe("Test generating reports with CSV connector", () => {
        test("Generate report 'FixedPayDay' from csv samples as expected", async () => {
            const expected: ReportFixedPayDay = {
                type: "fixedpayday",
                report: {
                    date: "15.11.2021",
                    sum: -704.98,
                    unpaidSum: -39.99,
                    namedFixedPayDays: [
                        {
                            name: "rent",
                            fixedPayDay: {
                                value: -650,
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
                                        value: -650,
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
                                        value: -650,
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
                                value: -14.99,
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
                                        value: -14.99,
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
                                        value: -14.99,
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
                                        value: -14.99,
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
                                value: -39.99,
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
                                        value: -39.99,
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
                                        value: -39.99,
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
                },
            };

            const options: Configuration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [
                        "booking",
                        "valuta",
                        "initiator",
                        "bookingtext",
                        "randominformation",
                        "use",
                        "balance",
                        "currency",
                        "amount",
                        "currency",
                    ],
                },
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
                startDate: "01.09.2021",
                endDate: "15.11.2021",
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                }),
            ).toStrictEqual(expected);
        });

        test("Generate report 'Trend' from csv samples as expected", async () => {
            const expected: ReportTrend = {
                type: "trend",
                report: {
                    trends: [
                        {
                            type: "fixed",
                            categories: [
                                {
                                    name: "rent",
                                    periods: [
                                        {
                                            value: -650,
                                            bookingDate: "01.06.2021",
                                            period: "2021.06",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 6,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.07.2021",
                                            period: "2021.07",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 7,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.08.2021",
                                            period: "2021.08",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 8,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.09.2021",
                                            period: "2021.09",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 9,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.10.2021",
                                            period: "2021.10",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 10,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.11.2021",
                                            period: "2021.11",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 11,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -650,
                                            bookingDate: "01.12.2021",
                                            period: "2021.12",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 12,
                                                    year: 2021,
                                                    initiator:
                                                        "Rent for my crib",
                                                    purpose: "Thanks landlord",
                                                    value: -650,
                                                    category: {
                                                        name: "rent",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: "insurance",
                                    periods: [
                                        {
                                            value: -14.99,
                                            bookingDate: "03.09.2021",
                                            period: "2021.09",
                                            transactions: [
                                                {
                                                    day: 3,
                                                    month: 9,
                                                    year: 2021,
                                                    initiator:
                                                        "Stay Healthy Corp.",
                                                    purpose:
                                                        "Your health is our mission",
                                                    value: -14.99,
                                                    category: {
                                                        name: "insurance",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -14.99,
                                            bookingDate: "01.10.2021",
                                            period: "2021.10",
                                            transactions: [
                                                {
                                                    day: 1,
                                                    month: 10,
                                                    year: 2021,
                                                    initiator:
                                                        "Stay Healthy Corp.",
                                                    purpose:
                                                        "Your health is our mission",
                                                    value: -14.99,
                                                    category: {
                                                        name: "insurance",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -14.99,
                                            bookingDate: "02.11.2021",
                                            period: "2021.11",
                                            transactions: [
                                                {
                                                    day: 2,
                                                    month: 11,
                                                    year: 2021,
                                                    initiator:
                                                        "Stay Healthy Corp.",
                                                    purpose:
                                                        "Your health is our mission",
                                                    value: -14.99,
                                                    category: {
                                                        name: "insurance",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -14.99,
                                            bookingDate: "03.12.2021",
                                            period: "2021.12",
                                            transactions: [
                                                {
                                                    day: 3,
                                                    month: 12,
                                                    year: 2021,
                                                    initiator:
                                                        "Stay Healthy Corp.",
                                                    purpose:
                                                        "Your health is our mission",
                                                    value: -14.99,
                                                    category: {
                                                        name: "insurance",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: "mobile",
                                    periods: [
                                        {
                                            value: -39.99,
                                            bookingDate: "22.09.2021",
                                            period: "2021.09",
                                            transactions: [
                                                {
                                                    day: 22,
                                                    month: 9,
                                                    year: 2021,
                                                    initiator: "Mobilio Ltd.",
                                                    purpose:
                                                        "your mobile phone provider",
                                                    value: -39.99,
                                                    category: {
                                                        name: "mobile",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -39.99,
                                            bookingDate: "22.10.2021",
                                            period: "2021.10",
                                            transactions: [
                                                {
                                                    day: 22,
                                                    month: 10,
                                                    year: 2021,
                                                    initiator: "Mobilio Ltd.",
                                                    purpose:
                                                        "your mobile phone provider",
                                                    value: -39.99,
                                                    category: {
                                                        name: "mobile",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            value: -39.99,
                                            bookingDate: "22.11.2021",
                                            period: "2021.11",
                                            transactions: [
                                                {
                                                    day: 22,
                                                    month: 11,
                                                    year: 2021,
                                                    initiator: "Mobilio Ltd.",
                                                    purpose:
                                                        "your mobile phone provider",
                                                    value: -39.99,
                                                    category: {
                                                        name: "mobile",
                                                        type: "fixed",
                                                        period: "monthly",
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "variable",
                            categories: [
                                {
                                    name: "shopping",
                                    periods: [
                                        {
                                            sum: -18.45,
                                            period: "2021.08",
                                            transactions: [
                                                {
                                                    day: 20,
                                                    month: 8,
                                                    year: 2021,
                                                    initiator:
                                                        "cool-gadgets.com",
                                                    purpose:
                                                        "cool-gadgets.com.com",
                                                    value: -18.45,
                                                    category: {
                                                        name: "shopping",
                                                        type: "variable",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            sum: -44.86,
                                            period: "2021.09",
                                            transactions: [
                                                {
                                                    day: 21,
                                                    month: 9,
                                                    year: 2021,
                                                    initiator:
                                                        "my-online-shop.com",
                                                    purpose:
                                                        "my-online-shop.com",
                                                    value: -44.86,
                                                    category: {
                                                        name: "shopping",
                                                        type: "variable",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            sum: -23.65,
                                            period: "2021.10",
                                            transactions: [
                                                {
                                                    day: 19,
                                                    month: 10,
                                                    year: 2021,
                                                    initiator:
                                                        "my-online-shop.com",
                                                    purpose:
                                                        "my-online-shop.com",
                                                    value: -23.65,
                                                    category: {
                                                        name: "shopping",
                                                        type: "variable",
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            sum: -9.99,
                                            period: "2021.11",
                                            transactions: [
                                                {
                                                    day: 22,
                                                    month: 11,
                                                    year: 2021,
                                                    initiator:
                                                        "my-online-shop.com",
                                                    purpose:
                                                        "my-online-shop.com",
                                                    value: -9.99,
                                                    category: {
                                                        name: "shopping",
                                                        type: "variable",
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            };

            const options: Configuration = {
                allowedLogLevel: "none",
                source: {
                    type: "csv",
                    path: __dirname + "/samples/sample1.csv",
                    dataKeys: {
                        date: "booking",
                        initiator: "initiator",
                        purpose: "use",
                        value: "amount",
                    },
                    columns: [
                        "booking",
                        "valuta",
                        "initiator",
                        "bookingtext",
                        "randominformation",
                        "use",
                        "balance",
                        "currency",
                        "amount",
                        "currency",
                    ],
                },
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
                    {
                        name: "shopping",
                        type: TransactionType.Variable,
                        samples: [
                            { initiator: "my-online-shop.com" },
                            { initiator: "cool-gadgets.com" },
                        ],
                    },
                ],
            };

            expect(
                await generateReport(options, {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                }),
            ).toStrictEqual(expected);
        });
    });
});
