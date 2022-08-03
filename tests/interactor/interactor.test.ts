import { generateReport } from "../../src/interactor/interactor";
import { TransactionType } from "../../src/types/enums";
import {
    expectedReportFixedPayDay,
    expectedReportTrend,
} from "./samples/expected";

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
                    mode: "",
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
                    mode: "",
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
                    formats: [
                        {
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
                    ],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "unknown",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
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
                    formats: [
                        {
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
                    mode: "",
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
                    formats: [
                        {
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
                    mode: "",
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
                    formats: [],
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
                    mode: "",
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
                    formats: [],
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
                    mode: "",
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
                    formats: [
                        {
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
                    ],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
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
                    formats: [
                        {
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
                    ],
                },
                categories: [],
            };

            expect(
                await generateReport(options, {
                    report: "trend",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual({
                source: "trend.ts",
                message: "There are no transactions.",
            });
        });
    });

    describe("Test generating reports with CSV connector", () => {
        test("Generate report 'FixedPayDay' from csv samples as expected", async () => {
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
                    formats: [
                        {
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
                    mode: "",
                }),
            ).toStrictEqual(expectedReportFixedPayDay);
        });

        test("Generate report 'Trend' from csv samples as expected", async () => {
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
                    formats: [
                        {
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
                    mode: "",
                }),
            ).toStrictEqual(expectedReportTrend);
        });
    });
});
