import { generateReport } from "../../src/interactor/interactor";
import {
    expectedReportFixedPayDay,
    expectedReportFixedPayDayAndStoredEntries,
    expectedReportTrend,
    expectedReportTrendAndStored,
} from "./samples/expected";
import { rmSync, existsSync, writeFileSync, cpSync } from "fs";
import {
    unknownConnectorType,
    malformedConnectorType,
    unknownReportType,
    strictIsTrue,
    strictIsTrueAndSomeTransactionMatch,
    csvFileDoesNotExist,
    csvFileDoesNotEndWithCsv,
    fixedPayDayNoTransactions,
    trendNoTransactions,
    fixedPayDayFromCsv,
    fixedPayDayFromCsvAndStored,
    trendFromCsv,
} from "./samples/options";

const dataJsonTestPath = __dirname + "/samples/data.json";
const backUpPath = __dirname + "/samples/backup/";

describe("Test Interactor", () => {
    beforeEach(() => {
        if (existsSync(dataJsonTestPath)) rmSync(dataJsonTestPath);

        if (existsSync(backUpPath)) {
            cpSync(backUpPath, __dirname + "/samples/", {
                recursive: true,
                force: true,
            });
            rmSync(backUpPath, { recursive: true });
        }
    });

    afterAll(() => {
        if (existsSync(dataJsonTestPath)) rmSync(dataJsonTestPath);

        if (existsSync(backUpPath)) {
            cpSync(backUpPath, __dirname + "/samples/", {
                recursive: true,
                force: true,
            });
            rmSync(backUpPath, { recursive: true });
        }
    });

    describe("Test falsy parameters", () => {
        test("Unknown connector type", async () => {
            const result = await generateReport(unknownConnectorType, {
                report: "fixedpayday",
                trendType: "",
                configurationPath: "",
                mode: "",
            });

            expect(result).toStrictEqual({
                source: "interactor.ts",
                message: `Unkown connector type "${unknownConnectorType.source.type}".`,
            });
        });

        test("Unknown csv connector type, malformed object", async () => {
            expect(
                await generateReport(malformedConnectorType, {
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
            expect(
                await generateReport(unknownReportType, {
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
            expect(
                await generateReport(strictIsTrue, {
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
            expect(
                await generateReport(strictIsTrueAndSomeTransactionMatch, {
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
            expect(
                await generateReport(csvFileDoesNotExist, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `CSV file with transaction data not found. Path: "${csvFileDoesNotExist.source.path}".`,
            });
        });

        test("ApplicationError, when file doesn't end with .csv", async () => {
            expect(
                await generateReport(csvFileDoesNotEndWithCsv, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual({
                source: "csv.ts",
                message: `Path needs to end with ".csv", path is "${csvFileDoesNotEndWithCsv.source.path}"`,
            });
        });

        test("FixedPayDay ApplicationError, when there are no transactions", async () => {
            expect(
                await generateReport(fixedPayDayNoTransactions, {
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
            expect(
                await generateReport(trendNoTransactions, {
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
            expect(
                await generateReport(fixedPayDayFromCsv, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual(expectedReportFixedPayDay);
        });

        test("Generate report 'FixedPayDay' from stored csv samples as expected, ", async () => {
            // create store
            const testStore: ExtendedTransactionStore = {
                size: 2,
                latestEntry: 1,
                extendedTransactions: [
                    {
                        id: 0,
                        date: new Date(2021, 8, 2),
                        initiator: "Already in store insurance",
                        purpose: "stored and healthy",
                        value: -99.87,
                        category: {
                            name: "insurance",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 1,
                        date: new Date(2021, 8, 2),
                        initiator: "stored phone company",
                        purpose: "your stored phone provider",
                        value: -59.99,
                        category: {
                            name: "mobile",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                ],
            };
            writeFileSync(dataJsonTestPath, JSON.stringify(testStore), {
                encoding: "utf-8",
                flag: "w+",
            });

            expect(
                await generateReport(fixedPayDayFromCsvAndStored, {
                    report: "fixedpayday",
                    trendType: "",
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual(expectedReportFixedPayDayAndStoredEntries);
        });

        test("Generate report 'Trend' from csv samples as expected", async () => {
            expect(
                await generateReport(trendFromCsv, {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual(expectedReportTrend);
        });

        test("Generate report 'Trend' from stored csv samples as expected, ", async () => {
            // create store
            const testStore: ExtendedTransactionStore = {
                size: 2,
                latestEntry: 1,
                extendedTransactions: [
                    {
                        id: 0,
                        date: new Date(2021, 7, 3),
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
                        id: 1,
                        date: new Date(2021, 7, 2),
                        initiator: "cool-gadgets.com",
                        purpose: "cool-gadgets.com.com",
                        value: -99.99,
                        category: {
                            name: "shopping",
                            type: "variable",
                        },
                    },
                ],
            };
            writeFileSync(dataJsonTestPath, JSON.stringify(testStore), {
                encoding: "utf-8",
                flag: "w+",
            });

            expect(
                await generateReport(trendFromCsv, {
                    report: "trend",
                    trendType: undefined,
                    configurationPath: "",
                    mode: "",
                }),
            ).toStrictEqual(expectedReportTrendAndStored);
        });
    });
});
