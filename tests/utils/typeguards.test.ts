import {
    isCsvOptions,
    isDataKeys,
    isCategory,
    isSampledCategory,
    isConfiguration,
    isApplicationError,
    isFixedCategoryTrendPeriod,
    isVariableCategoryTrendPeriod,
    isReportFixedPayDay,
    isReportTrend,
} from "../../src/utils/typeguards";

describe("Test utils/typeguards", () => {
    describe("Check if object is CsvConnectorOptions", () => {
        test("Null is not a CsvConnectorOptions", () => {
            expect(isCsvOptions(null)).toBeFalsy();
        });

        test("undefined is not a CsvConnectorOptions", () => {
            expect(isCsvOptions(undefined)).toBeFalsy();
        });

        test("Empty object is not a CsvConnectorOptions", () => {
            expect(isCsvOptions({})).toBeFalsy();
        });

        test("string is not a CsvConnectorOptions", () => {
            expect(isCsvOptions("hello")).toBeFalsy();
        });

        test("number is not a CsvConnectorOptions", () => {
            expect(isCsvOptions(123)).toBeFalsy();
        });

        test("CsvConnectorOptions is not a CsvConnectorOptions without deep equality", () => {
            const csvConnectorOptions = {
                type: "csv",
                path: "",
                dataKeys: {},
                columns: [],
                dateFormat: "",
            };
            expect(isCsvOptions(csvConnectorOptions)).toBeFalsy();
        });

        test("CsvConnectorOptions is a CsvConnectorOptions", () => {
            const csvConnectorOptions = {
                type: "csv",
                path: "",
                dataKeys: { date: "", initiator: "", purpose: "", value: "" },
                columns: [],
                dateFormat: "",
            };
            expect(isCsvOptions(csvConnectorOptions)).toBeTruthy();
        });
    });

    describe("Check if object is DataKeys", () => {
        test("Null is not DataKeys", () => {
            expect(isDataKeys(null)).toBeFalsy();
        });

        test("undefined is not DataKeys", () => {
            expect(isDataKeys(undefined)).toBeFalsy();
        });

        test("Empty object is not DataKeys", () => {
            expect(isDataKeys({})).toBeFalsy();
        });

        test("string is not DataKeys", () => {
            expect(isDataKeys("hello")).toBeFalsy();
        });

        test("number is not DataKeys", () => {
            expect(isDataKeys(123)).toBeFalsy();
        });

        test("DataKeys is DataKeys", () => {
            const DataKeys = {
                date: "",
                initiator: "",
                purpose: "",
                value: "",
            };
            expect(isDataKeys(DataKeys)).toBeTruthy();
        });
    });

    describe("Check if object is Category", () => {
        test("Null is not a Category", () => {
            expect(isCategory(null)).toBeFalsy();
        });

        test("undefined is not a Category", () => {
            expect(isCategory(undefined)).toBeFalsy();
        });

        test("Empty object is not a Category", () => {
            expect(isCategory({})).toBeFalsy();
        });

        test("string is not a Category", () => {
            expect(isCategory("hello")).toBeFalsy();
        });

        test("number is not a Category", () => {
            expect(isCategory(123)).toBeFalsy();
        });

        test("Category is a Category", () => {
            const category = { name: "", type: "" };
            expect(isCategory(category)).toBeTruthy();
        });
    });

    describe("Check if object is SampledCategory", () => {
        test("Null is not a SampledCategory", () => {
            expect(isSampledCategory(null)).toBeFalsy();
        });

        test("undefined is not a SampledCategory", () => {
            expect(isSampledCategory(undefined)).toBeFalsy();
        });

        test("Empty object is not a SampledCategory", () => {
            expect(isSampledCategory({})).toBeFalsy();
        });

        test("string is not a SampledCategory", () => {
            expect(isSampledCategory("hello")).toBeFalsy();
        });

        test("number is not a SampledCategory", () => {
            expect(isSampledCategory(123)).toBeFalsy();
        });

        test("SampledCategory is a SampledCategory", () => {
            const category = { name: "", type: "", samples: [] };
            expect(isSampledCategory(category)).toBeTruthy();
        });
    });

    describe("Check if object is Configuration", () => {
        test("Null is not an Configuration", () => {
            expect(isConfiguration(null)).toBeFalsy();
        });

        test("undefined is not an Configuration", () => {
            expect(isConfiguration(undefined)).toBeFalsy();
        });

        test("Empty object is not an Configuration", () => {
            expect(isConfiguration({})).toBeFalsy();
        });

        test("string is not an Configuration", () => {
            expect(isConfiguration("hello")).toBeFalsy();
        });

        test("number is not an Configuration", () => {
            expect(isConfiguration(123)).toBeFalsy();
        });

        test("Configuration is an Configuration without deep equality", () => {
            const configuration = { categories: [], source: {} };
            expect(isConfiguration(configuration)).toBeFalsy();
        });

        test("Configuration is an Configuration", () => {
            const configuration = {
                categories: [],
                source: {
                    type: "csv",
                    columns: [],
                    dataKeys: {
                        purpose: "",
                        date: "",
                        initiator: "",
                        value: "",
                    },
                    path: "",
                },
            };
            expect(isConfiguration(configuration)).toBeTruthy();
        });
    });

    describe("Check if object is ApplicationError", () => {
        test("Null is not an ApplicationError", () => {
            expect(isApplicationError(null)).toBeFalsy();
        });

        test("undefined is not an ApplicationError", () => {
            expect(isApplicationError(undefined)).toBeFalsy();
        });

        test("Empty object is not an ApplicationError", () => {
            expect(isApplicationError({})).toBeFalsy();
        });

        test("string is not an ApplicationError", () => {
            expect(isApplicationError("hello")).toBeFalsy();
        });

        test("number is not an ApplicationError", () => {
            expect(isApplicationError(123)).toBeFalsy();
        });

        test("ApplicationError is an ApplicationError", () => {
            const applicationError = { source: "", message: "" };
            expect(isApplicationError(applicationError)).toBeTruthy();
        });
    });

    describe("Check if object is FixedCategoryTrendPeriod", () => {
        test("Null is not an FixedCategoryTrendPeriod", () => {
            expect(isFixedCategoryTrendPeriod(null)).toBeFalsy();
        });

        test("undefined is not an FixedCategoryTrendPeriod", () => {
            expect(isFixedCategoryTrendPeriod(undefined)).toBeFalsy();
        });

        test("Empty object is not an FixedCategoryTrendPeriod", () => {
            expect(isFixedCategoryTrendPeriod({})).toBeFalsy();
        });

        test("string is not an FixedCategoryTrendPeriod", () => {
            expect(isFixedCategoryTrendPeriod("hello")).toBeFalsy();
        });

        test("number is not an FixedCategoryTrendPeriod", () => {
            expect(isFixedCategoryTrendPeriod(123)).toBeFalsy();
        });

        test("FixedCategoryTrendPeriod is not an FixedCategoryTrendPeriod", () => {
            const expected = { period: "", transactions: [] };
            expect(isFixedCategoryTrendPeriod(expected)).toBeFalsy();
        });

        test("FixedCategoryTrendPeriod is an FixedCategoryTrendPeriod", () => {
            const expected = {
                period: "",
                transactions: [],
                value: "",
                bookingDate: "",
            };
            expect(isFixedCategoryTrendPeriod(expected)).toBeTruthy();
        });
    });

    describe("Check if object is VariableCategoryTrendPeriod", () => {
        test("Null is not an VariableCategoryTrendPeriod", () => {
            expect(isVariableCategoryTrendPeriod(null)).toBeFalsy();
        });

        test("undefined is not an VariableCategoryTrendPeriod", () => {
            expect(isVariableCategoryTrendPeriod(undefined)).toBeFalsy();
        });

        test("Empty object is not an VariableCategoryTrendPeriod", () => {
            expect(isVariableCategoryTrendPeriod({})).toBeFalsy();
        });

        test("string is not an VariableCategoryTrendPeriod", () => {
            expect(isVariableCategoryTrendPeriod("hello")).toBeFalsy();
        });

        test("number is not an VariableCategoryTrendPeriod", () => {
            expect(isVariableCategoryTrendPeriod(123)).toBeFalsy();
        });

        test("VariableCategoryTrendPeriod is not an VariableCategoryTrendPeriod", () => {
            const expected = {
                period: "",
                transactions: [],
            };
            expect(isVariableCategoryTrendPeriod(expected)).toBeFalsy();
        });

        test("VariableCategoryTrendPeriod is an VariableCategoryTrendPeriod", () => {
            const expected = {
                period: "",
                transactions: [],
                sum: "",
            };
            expect(isVariableCategoryTrendPeriod(expected)).toBeTruthy();
        });
    });

    describe("Check if object is ReportFixedPayDay", () => {
        test("Null is not an ReportFixedPayDay", () => {
            expect(isReportFixedPayDay(null)).toBeFalsy();
        });

        test("undefined is not an ReportFixedPayDay", () => {
            expect(isReportFixedPayDay(undefined)).toBeFalsy();
        });

        test("Empty object is not an ReportFixedPayDay", () => {
            expect(isReportFixedPayDay({})).toBeFalsy();
        });

        test("string is not an ReportFixedPayDay", () => {
            expect(isReportFixedPayDay("hello")).toBeFalsy();
        });

        test("number is not an ReportFixedPayDay", () => {
            expect(isReportFixedPayDay(123)).toBeFalsy();
        });

        test("ReportFixedPayDay is not an ReportFixedPayDay", () => {
            const expected = {
                type: "unknown",
            };
            expect(isReportFixedPayDay(expected)).toBeFalsy();
        });

        test("ReportFixedPayDay is an ReportFixedPayDay", () => {
            const expected = {
                type: "fixedpayday",
                namedFixedPayDays: [],
                sum: 0,
                unpaidSum: 0,
            };
            expect(isReportFixedPayDay(expected)).toBeTruthy();
        });
    });

    describe("Check if object is ReportTrend", () => {
        test("Null is not an ReportTrend", () => {
            expect(isReportTrend(null)).toBeFalsy();
        });

        test("undefined is not an ReportTrend", () => {
            expect(isReportTrend(undefined)).toBeFalsy();
        });

        test("Empty object is not an ReportTrend", () => {
            expect(isReportTrend({})).toBeFalsy();
        });

        test("string is not an ReportTrend", () => {
            expect(isReportTrend("hello")).toBeFalsy();
        });

        test("number is not an ReportTrend", () => {
            expect(isReportTrend(123)).toBeFalsy();
        });

        test("ReportTrend is not an ReportTrend", () => {
            const expected = {
                type: "unknown",
            };
            expect(isReportTrend(expected)).toBeFalsy();
        });

        test("ReportTrend is an ReportTrend", () => {
            const expected: ReportTrend = {
                type: "trend",
                trends: [],
            };
            expect(isReportTrend(expected)).toBeTruthy();
        });
    });
});
