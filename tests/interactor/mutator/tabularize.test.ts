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
                    { currency: "$", dateFormat: "MM/dd/yyyy" },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedFixedPayDayReportWithOptions,
                );
            });
        });
        describe("Test Trend Report", () => {
            test("Generate trend report for more than one transaction type", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", report: trendReport },
                    {
                        before: "13.12.2021",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportAll,
                );
            });

            test("Generate trend report for transaction type fixed", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", report: fixedTrendReport },
                    {
                        before: "13.12.2021",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportFixed,
                );
            });

            test("Generate trend report for transaction type variable", () => {
                const tabularizedReport = generateReportAsTable(
                    { type: "trend", report: variableTrendReport },
                    {
                        before: "13.12.2021",
                    },
                );
                expect(tabularizedReport).toStrictEqual(
                    tabularizedTrendReportVariable,
                );
            });
        });
    });
});
