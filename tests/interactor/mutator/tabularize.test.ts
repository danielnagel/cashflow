import { generateReportAsTable } from "../../../src/interactor/mutator/tabularize";
import {
    trendReport,
    fixedTrendReport,
    variableTrendReport,
} from "../report/samples/expected";
import { fixedPayDayReport } from "./samples/reports";
import {
    tabularizedFixedPayDayReport,
    tabularizedFixedPayDayReportWithOptions,
    tabularizedTrendReportAll,
    tabularizedTrendReportFixed,
    tabularizedTrendReportVariable,
} from "./samples/tabularizedReports";

describe("Test interactor/mutator/tabularize", () => {
    describe("Test function generateReportAsTable", () => {
        describe("Test falsy parameters", () => {
            test("FixedPayDay report has wrong format", () => {
                const tabularizedReport = generateReportAsTable({
                    type: "fixedpayday",
                });
                expect(tabularizedReport).toStrictEqual({
                    source: "tabularize.ts",
                    message: `Cannot print fixedpayday report! Report has wrong format.`,
                });
            });
            test("Trend report is null", () => {
                const tabularizedReport = generateReportAsTable({
                    type: "trend",
                });
                expect(tabularizedReport).toStrictEqual({
                    source: "tabularize.ts",
                    message: `Cannot print trend report! Report has wrong format.`,
                });
            });
            test("Unknown report", () => {
                const tabularizedReport = generateReportAsTable({
                    type: "unknown",
                });
                expect(tabularizedReport).toStrictEqual({
                    source: "tabularize.ts",
                    message: `Unkown report type: unknown!`,
                });
            });
        });
        describe("Test FixedPaxDay Report", () => {
            test("Generate table data as expected, without options", () => {
                const tabularizedReport =
                    generateReportAsTable(fixedPayDayReport);
                expect(tabularizedReport).toStrictEqual(
                    tabularizedFixedPayDayReport,
                );
            });
            test("Generate table data as expected, with options", () => {
                const tabularizedReport = generateReportAsTable(
                    fixedPayDayReport,
                    {
                        source: { type: "api" },
                        categories: [],
                        currency: "$",
                        dateFormat: "MM/dd/yyyy",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedFixedPayDayReportWithOptions,
                );
            });
        });
        describe("Test Trend Report", () => {
            test("Generate trend report for more than one transaction type", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", ...trendReport },
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "13.12.2021",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportAll,
                );
            });

            test("Generate trend report for transaction type fixed", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", ...fixedTrendReport },
                    {
                        source: { type: "api" },
                        categories: [],
                        dateFormat: "MM/dd/yyyy",
                        endDate: "12/13/2021",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportFixed,
                );
            });

            test("Generate trend report for transaction type variable", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", ...variableTrendReport },
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "13.12.2021",
                        currency: "€",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportVariable,
                );
            });
        });
    });
});
