import {
    loadTransactionData,
    parseRecordToTransaction,
} from "../../../src/interactor/connector/csv";
import { LogLevel } from "../../../src/types/enums";
import { existsSync, rmSync, cpSync } from "fs";

describe("Test connector/csv", () => {
    const backUpPath = __dirname + "/samples/backup/";

    beforeEach(() => {
        if (existsSync(backUpPath)) {
            cpSync(backUpPath, __dirname + "/samples/", {
                recursive: true,
                force: true,
            });
            rmSync(backUpPath, { recursive: true });
        }
    });

    afterAll(() => {
        if (existsSync(backUpPath)) {
            cpSync(backUpPath, __dirname + "/samples/", {
                recursive: true,
                force: true,
            });
            rmSync(backUpPath, { recursive: true });
        }
    });

    describe("Parse record to transaction", () => {
        const dataKeys = {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        };
        const record = {
            booking: "01.11.2021",
            initiator: "FOOD SHOP 1",
            use: "Thanks for paying the food",
            amount: "-23,00",
            randominformation: "blub",
        };
        const dateFormat = "dd.MM.yyyy";
        const expected = {
            initiator: "FOOD SHOP 1",
            purpose: "Thanks for paying the food",
            value: -23,
            date: new Date(2021, 10, 1),
        };

        test("Return ApplicationError, if record is empty", async () => {
            expect(
                parseRecordToTransaction({}, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return ApplicationError, if can't match data keys to record", async () => {
            expect(
                parseRecordToTransaction(
                    { example: "wow" },
                    dataKeys,
                    dateFormat,
                ),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return ApplicationError, if data keys date is undefined", async () => {
            expect(
                parseRecordToTransaction(
                    {
                        booking: undefined,
                        initiator: "2",
                        use: "3",
                        amount: "4",
                    },
                    dataKeys,
                    dateFormat,
                ),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return ApplicationError, if data keys initiator is undefined", async () => {
            expect(
                parseRecordToTransaction(
                    {
                        booking: "1",
                        initiator: undefined,
                        use: "3",
                        amount: "4",
                    },
                    dataKeys,
                    dateFormat,
                ),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return ApplicationError, if data keys use is undefined", async () => {
            expect(
                parseRecordToTransaction(
                    {
                        booking: "1",
                        initiator: "2",
                        use: undefined,
                        amount: "4",
                    },
                    dataKeys,
                    dateFormat,
                ),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return ApplicationError, if data keys amount is undefined", async () => {
            expect(
                parseRecordToTransaction(
                    {
                        booking: "1",
                        initiator: "2",
                        use: "3",
                        amount: undefined,
                    },
                    dataKeys,
                    dateFormat,
                ),
            ).toStrictEqual({
                source: "csv.ts",
                message: "Record doesn't match given data keys.",
            });
        });

        test("Return transaction, if data keys match record", async () => {
            expect(
                parseRecordToTransaction(record, dataKeys, dateFormat),
            ).toStrictEqual(expected);
        });

        test("Return ApplicationError, if booking date has not the expected format", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "01-11-2021";
            expect(
                parseRecordToTransaction(recordCopy, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Couldn't parse date. Date string is "${recordCopy.booking}", date format is "${dateFormat}".`,
            });
        });

        test("Return ApplicationError, if day of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "o1.11.2021";
            expect(
                parseRecordToTransaction(recordCopy, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Couldn't parse date. Date string is "${recordCopy.booking}", date format is "${dateFormat}".`,
            });
        });

        test("Return ApplicationError, if month of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "01.II.2021";
            expect(
                parseRecordToTransaction(recordCopy, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Couldn't parse date. Date string is "${recordCopy.booking}", date format is "${dateFormat}".`,
            });
        });

        test("Return ApplicationError, if year of booking date can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.booking = "1.11.asdf";
            expect(
                parseRecordToTransaction(recordCopy, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Couldn't parse date. Date string is "${recordCopy.booking}", date format is "${dateFormat}".`,
            });
        });

        test("Return ApplicationError, if amount can't be parsed", async () => {
            const recordCopy = { ...record };
            recordCopy.amount = "1.O1";
            expect(
                parseRecordToTransaction(recordCopy, dataKeys, dateFormat),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Couldn't parse value. Value string is "${recordCopy.amount}".`,
            });
        });
    });

    describe("Loading transaction data", () => {
        test("Stop loading data, when file does not exist", async () => {
            expect(
                await loadTransactionData({
                    source: {
                        type: "csv",
                        path: __dirname + "/samples/sample1_.csv",
                        dataKeys: {
                            date: "",
                            initiator: "",
                            purpose: "",
                            value: "",
                        },
                        formats: [],
                        dateFormat: "",
                        backUpPath: backUpPath,
                    },
                    allowedLogLevel: "none",
                    categories: [],
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `CSV file with transaction data not found. Path: "${
                    __dirname + "/samples/sample1_.csv"
                }".`,
            });
        });

        test("Stop loading data, when file does not end with '.csv'", async () => {
            expect(
                await loadTransactionData({
                    source: {
                        type: "csv",
                        path: __dirname + "/samples/sample3.txt",
                        dataKeys: {
                            date: "",
                            initiator: "",
                            purpose: "",
                            value: "",
                        },
                        formats: [],
                        dateFormat: "",
                        backUpPath: backUpPath,
                    },
                    allowedLogLevel: "none",
                    categories: [],
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Path needs to end with ".csv", path is "${
                    __dirname + "/samples/sample3.txt"
                }"`,
            });
        });

        test("ApplicationError, when there are no formats", async () => {
            expect(
                await loadTransactionData({
                    source: {
                        type: "csv",
                        path: __dirname + "/samples/sample1.csv",
                        dataKeys: {
                            date: "",
                            initiator: "",
                            purpose: "",
                            value: "",
                        },
                        formats: [],
                        dateFormat: "",
                        backUpPath: backUpPath,
                    },
                    allowedLogLevel: "none",
                    categories: [],
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: "There are no formats.",
            });
        });

        test("ApplicationError, when file does not exist", async () => {
            expect(
                await loadTransactionData({
                    source: {
                        type: "csv",
                        path: __dirname + "/samples/sample4.csv",
                        dataKeys: {
                            date: "",
                            initiator: "",
                            purpose: "",
                            value: "",
                        },
                        formats: [
                            {
                                columns: [],
                            },
                        ],
                        dateFormat: "",
                        backUpPath: backUpPath,
                    },
                    allowedLogLevel: "none",
                    categories: [],
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: "File sample4.csv does not exist.",
            });
        });

        test("Load data from existing sample file and generate transaction array", async () => {
            const transactionData = <Transaction[]>await loadTransactionData({
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
                    dateFormat: "dd.MM.yyyy",
                    backUpPath: backUpPath,
                },
                allowedLogLevel: "none",
                categories: [],
            });
            expect(transactionData).toHaveLength(3);
            expect(transactionData[0]).toStrictEqual({
                initiator: "FOOD SHOP 1",
                purpose: "Thanks for paying the food",
                value: -23,
                date: new Date(2021, 10, 1),
            });
            expect(transactionData[1]).toStrictEqual({
                initiator: "ONLINE SHOP 3",
                purpose: "Good choice mate 2345452",
                value: -57.21,
                date: new Date(2021, 10, 2),
            });
            expect(transactionData[2]).toStrictEqual({
                initiator: "ONLINE SHOP 3",
                purpose: "Good choice mate 2344534",
                value: -7.99,
                date: new Date(2021, 10, 3),
            });
        });

        test("Load data from sample file, with german and american decimals, and generate transaction array", async () => {
            const transactionData = <Transaction[]>await loadTransactionData({
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
                    dateFormat: "dd.MM.yyyy",
                    backUpPath: backUpPath,
                },
                allowedLogLevel: "none",
                categories: [],
            });
            expect(transactionData).toHaveLength(8);
            expect(transactionData[0]).toStrictEqual({
                initiator: "ONLINE SHOP 3",
                purpose: "Good choice mate 2344534",
                value: -7.99,
                date: new Date(2021, 10, 3),
            });
            expect(transactionData[1]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 5, 1),
            });
            expect(transactionData[2]).toStrictEqual({
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: -12.99,
                date: new Date(2021, 5, 1),
            });
            expect(transactionData[3]).toStrictEqual({
                initiator: "Grocerie Land",
                purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                value: -109.56,
                date: new Date(2021, 6, 7),
            });
            expect(transactionData[4]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 8, 1),
            });
            expect(transactionData[5]).toStrictEqual({
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: -14.99,
                date: new Date(2021, 8, 3),
            });
            expect(transactionData[6]).toStrictEqual({
                initiator: "Grocerie Land",
                purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                value: -88.86,
                date: new Date(2021, 7, 11),
            });
            expect(transactionData[7]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 7, 1),
            });
        });
    });

    describe("Loading transaction data from multiple files", () => {
        test("Load data from all csv files in a directory and generate transaction array", async () => {
            const transactionData = <Transaction[]>await loadTransactionData(
                {
                    source: {
                        type: "csv",
                        path: __dirname + "/samples",
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
                        dateFormat: "dd.MM.yyyy",
                        backUpPath: backUpPath,
                    },
                    allowedLogLevel: "none",
                    categories: [],
                },
                LogLevel.None,
            );
            expect(transactionData).toHaveLength(10);
            expect(transactionData[0]).toStrictEqual({
                initiator: "FOOD SHOP 1",
                purpose: "Thanks for paying the food",
                value: -23,
                date: new Date(2021, 10, 1),
            });
            expect(transactionData[1]).toStrictEqual({
                initiator: "ONLINE SHOP 3",
                purpose: "Good choice mate 2345452",
                value: -57.21,
                date: new Date(2021, 10, 2),
            });
            expect(transactionData[2]).toStrictEqual({
                initiator: "ONLINE SHOP 3",
                purpose: "Good choice mate 2344534",
                value: -7.99,
                date: new Date(2021, 10, 3),
            });
            expect(transactionData[3]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 5, 1),
            });
            expect(transactionData[4]).toStrictEqual({
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: -12.99,
                date: new Date(2021, 5, 1),
            });
            expect(transactionData[5]).toStrictEqual({
                initiator: "Grocerie Land",
                purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                value: -109.56,
                date: new Date(2021, 6, 7),
            });
            expect(transactionData[6]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 8, 1),
            });
            expect(transactionData[7]).toStrictEqual({
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: -14.99,
                date: new Date(2021, 8, 3),
            });
            expect(transactionData[8]).toStrictEqual({
                initiator: "Grocerie Land",
                purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                value: -88.86,
                date: new Date(2021, 7, 11),
            });
            expect(transactionData[9]).toStrictEqual({
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: -650,
                date: new Date(2021, 7, 1),
            });
        });
    });

    test("Load data from all csv files in a directory, with different columns, and generate transaction array", async () => {
        const transactionData = <Transaction[]>await loadTransactionData(
            {
                source: {
                    type: "csv",
                    path: __dirname + "/samples",
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
                        {
                            columns: [
                                "booking",
                                "valuta",
                                "initiator",
                                "bookingtext",
                                "note",
                                "randominformation",
                                "use",
                                "balance",
                                "currency",
                                "amount",
                                "currency",
                            ],
                        },
                    ],
                    dateFormat: "dd.MM.yyyy",
                    backUpPath: backUpPath,
                },
                allowedLogLevel: "none",
                categories: [],
            },
            LogLevel.None,
        );
        expect(transactionData).toHaveLength(13);
        expect(transactionData[0]).toStrictEqual({
            initiator: "FOOD SHOP 1",
            purpose: "Thanks for paying the food",
            value: -23,
            date: new Date(2021, 10, 1),
        });
        expect(transactionData[1]).toStrictEqual({
            initiator: "ONLINE SHOP 3",
            purpose: "Good choice mate 2345452",
            value: -57.21,
            date: new Date(2021, 10, 2),
        });
        expect(transactionData[2]).toStrictEqual({
            initiator: "ONLINE SHOP 3",
            purpose: "Good choice mate 2344534",
            value: -7.99,
            date: new Date(2021, 10, 3),
        });
        expect(transactionData[3]).toStrictEqual({
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 5, 1),
        });
        expect(transactionData[4]).toStrictEqual({
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: -12.99,
            date: new Date(2021, 5, 1),
        });
        expect(transactionData[5]).toStrictEqual({
            initiator: "Grocerie Land",
            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
            value: -109.56,
            date: new Date(2021, 6, 7),
        });
        expect(transactionData[6]).toStrictEqual({
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 8, 1),
        });
        expect(transactionData[7]).toStrictEqual({
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: -14.99,
            date: new Date(2021, 8, 3),
        });
        expect(transactionData[8]).toStrictEqual({
            initiator: "Grocerie Land",
            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
            value: -88.86,
            date: new Date(2021, 7, 11),
        });
        expect(transactionData[9]).toStrictEqual({
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 7, 1),
        });
        expect(transactionData[10]).toStrictEqual({
            initiator: "ONLINE SHOP 4",
            purpose: "Good choice mate 23454532",
            value: -7.99,
            date: new Date(2021, 10, 8),
        });
        expect(transactionData[11]).toStrictEqual({
            initiator: "Grocerie Land",
            purpose: "VISA 144 GROCERIE LAND TES71234234523452345",
            value: -88.86,
            date: new Date(2021, 7, 14),
        });
        expect(transactionData[12]).toStrictEqual({
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 9, 5),
        });
    });
});
