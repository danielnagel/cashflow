import { generateReportAsTable } from "../../../src/interactor/mutator/tabularize";
import { fixedPayDayReport, trendReport } from "./samples/reports";
import {
    tabularizedFixedPayDayReport,
    tabularizedFixedPayDayReportWithOptions,
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
            test("test stub", () => {
                const tabularizedReport = generateReportAsTable(trendReport);
                expect(tabularizedReport).toStrictEqual({
                    source: "tabularize.ts",
                    message: "trendReportAsTable is unimplemented!",
                });
            });
        });
    });
});
