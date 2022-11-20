import {
    generateFixedPayDay,
    generateFixedPayDayReport,
} from "../../../src/interactor/report/fixedPayDay";
import { TransactionType } from "../../../src/types/enums";
import { categorizedTransactions } from "./samples/categorizedTransactions";
import {
    expectedFixedPayDay1,
    expectedFixedPayDay2,
    expectedFixedPayDay3,
    expectedFixedPayDay4,
    expectedFixedPayDay5,
    expectedFixedPayDay6,
    expectedFixedPayDay7,
    expectedFixedPayDay8,
    expectedFixedPayDay9,
    expectedFixedPayDay10,
    expectedFixedPayDay11,
    expectedFixedPayDayReport,
} from "./samples/expected";

describe("Test fixCostReport", () => {
    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date(2021, 9, 2));
    });

    afterEach(() => {
        jest.setSystemTime(new Date(2021, 9, 2));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

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

            const transactions: ExtendedTransaction[] = [
                {
                    id: 99,
                    date: new Date(2021, 9, 19),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 23.65,
                    category: {
                        name: "unmatched",
                        type: TransactionType.Variable,
                    },
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
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay1);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "rent",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.10.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay2);
            });

            test("Generate fix cost as expected, with since Date", () => {
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

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay3);
            });
        });

        describe("Test fixed pay days to match multiple interactors (samples), which are the same fix cost, but the interactor name changes; different booking days", () => {
            test("Generate fix cost as expected", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay4);
            });

            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "01.09.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay5);
            });

            test("Generate fix cost as expected, with since Date", () => {
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

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay6);
            });

            test("Generate fix cost as expected, without specified Date", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay7);
            });

            test("Match samples that only differ in purpose", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "music subscription",
                    {
                        source: { type: "api" },
                        categories: [],
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay8);
            });

            test("Match categories without periods", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "gaming subscription",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "30.11.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay9);
            });
        });

        describe("Test fixed pay day generation with non-monthly periods", () => {
            test("Fixed pay day generation for yearly periods", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "car insurance",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay10);
            });

            test("Fixed pay day generation for quarter-yearly periods", () => {
                const fixedPayDay = generateFixedPayDay(
                    categorizedTransactions,
                    "luxury",
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "31.12.2021",
                    },
                );

                expect(fixedPayDay).toStrictEqual(expectedFixedPayDay11);
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
                ).toStrictEqual(expectedFixedPayDayReport);
            });
        });
    });
});
