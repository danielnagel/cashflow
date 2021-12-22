import { generateReport } from "../../src/interactor/interactor";
import { TransactionType } from "../../src/types/enums";

describe("Test Interactor", () => {
    describe("Test generating reports with CSV connector", () => {
        describe("Generate categorized fix costs from samples", () => {
            test("Generate categorized fix costs as expected", async () => {
                const expected: FixedPayDayReport = {
                    type: "fixcost",
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
                                            purpose:
                                                "Your health is our mission",
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
                                            purpose:
                                                "Your health is our mission",
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
                                            purpose:
                                                "your mobile phone provider",
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
                            },
                        ],
                    },
                };

                const options: Configuration = {
                    logger: { allowedLogLevel: "none" },
                    interactor: {
                        connector: {
                            type: "csv",
                            options: {
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
                                dateFormat: "dd.MM.yyyy",
                            },
                        },
                        mutator: {
                            skipErrors: true,
                            categories: [
                                {
                                    name: "rent",
                                    type: TransactionType.Fixed,
                                    samples: [
                                        { initiator: "Rent for my crib" },
                                    ],
                                },
                                {
                                    name: "insurance",
                                    type: TransactionType.Fixed,
                                    samples: [
                                        { initiator: "Stay Healthy Corp." },
                                    ],
                                },
                                {
                                    name: "mobile",
                                    type: TransactionType.Fixed,
                                    samples: [{ initiator: "Mobilio Ltd." }],
                                },
                            ],
                        },
                        report: {
                            type: "fixedpayday",
                            options: {
                                before: "15.11.2021",
                                after: "01.09.2021",
                            },
                        },
                    },
                };

                expect(await generateReport(options)).toStrictEqual(expected);
            });
        });
    });
});
