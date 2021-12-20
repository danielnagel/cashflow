import {
    isInteractorOptions,
    isConnectorOptions,
    isReportOptions,
    isCsvOptions,
    isCategorizeOptions,
    isDataKeys,
    isCategory,
    isSampledCategory,
    isConfiguration,
    isApplicationError,
} from "../../src/utils/typeguards";

describe("Test utils/typeguards", () => {
    describe("Check if object is InteractorOptions", () => {
        test("Null is not an InteractorOptions", () => {
            expect(isInteractorOptions(null)).toBeFalsy();
        });

        test("undefined is not an InteractorOptions", () => {
            expect(isInteractorOptions(undefined)).toBeFalsy();
        });

        test("Empty object is not an InteractorOptions", () => {
            expect(isInteractorOptions({})).toBeFalsy();
        });

        test("string is not an InteractorOptions", () => {
            expect(isInteractorOptions("hello")).toBeFalsy();
        });

        test("number is not an InteractorOptions", () => {
            expect(isInteractorOptions(123)).toBeFalsy();
        });

        test("InteractorOptions is an InteractorOptions without deep equality", () => {
            const interactorOptions = {
                connector: {},
                report: {},
                mutator: {},
            };
            expect(isInteractorOptions(interactorOptions)).toBeFalsy();
        });

        test("InteractorOptions is an InteractorOptions", () => {
            const interactorOptions = {
                connector: {
                    type: "",
                    options: {
                        path: "",
                        dataKeys: {
                            date: "",
                            initiator: "",
                            purpose: "",
                            value: "",
                        },
                        columns: [],
                        dateFormat: "",
                    },
                },
                report: {
                    type: "",
                    options: {
                        categories: [],
                    },
                },
                mutator: {
                    categories: [],
                },
            };
            expect(isInteractorOptions(interactorOptions)).toBeTruthy();
        });
    });

    describe("Check if object is ConnectorOptions", () => {
        test("Null is not a ConnectorOptions", () => {
            expect(isConnectorOptions(null)).toBeFalsy();
        });

        test("undefined is not a ConnectorOptions", () => {
            expect(isConnectorOptions(undefined)).toBeFalsy();
        });

        test("Empty object is not a ConnectorOptions", () => {
            expect(isConnectorOptions({})).toBeFalsy();
        });

        test("string is not a ConnectorOptions", () => {
            expect(isConnectorOptions("hello")).toBeFalsy();
        });

        test("number is not a ConnectorOptions", () => {
            expect(isConnectorOptions(123)).toBeFalsy();
        });

        test("ConnectorOptions is an ConnectorOptions without deep equality", () => {
            const connectorOptions = { type: "", options: {} };
            expect(isConnectorOptions(connectorOptions)).toBeFalsy();
        });

        test("ConnectorOptions is a ConnectorOptions", () => {
            const connectorOptions = {
                type: "",
                options: {
                    path: "",
                    dataKeys: {
                        date: "",
                        initiator: "",
                        purpose: "",
                        value: "",
                    },
                    columns: [],
                    dateFormat: "",
                },
            };
            expect(isConnectorOptions(connectorOptions)).toBeTruthy();
        });
    });

    describe("Check if object is ReportOptions", () => {
        test("Null is not a ReportOptions", () => {
            expect(isReportOptions(null)).toBeFalsy();
        });

        test("undefined is not a ReportOptions", () => {
            expect(isReportOptions(undefined)).toBeFalsy();
        });

        test("Empty object is not a ReportOptions", () => {
            expect(isReportOptions({})).toBeFalsy();
        });

        test("string is not a ReportOptions", () => {
            expect(isReportOptions("hello")).toBeFalsy();
        });

        test("number is not a ReportOptions", () => {
            expect(isReportOptions(123)).toBeFalsy();
        });

        test("ReportOptions is a ReportOptions", () => {
            const reportOptions = { type: "", options: {} };
            expect(isReportOptions(reportOptions)).toBeTruthy();
        });
    });

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
                path: "",
                dataKeys: {},
                columns: [],
                dateFormat: "",
            };
            expect(isCsvOptions(csvConnectorOptions)).toBeFalsy();
        });

        test("CsvConnectorOptions is a CsvConnectorOptions", () => {
            const csvConnectorOptions = {
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

    describe("Check if object is CategorizeOptions", () => {
        test("Null is not a CategorizeOptions", () => {
            expect(isCategorizeOptions(null)).toBeFalsy();
        });

        test("undefined is not a CategorizeOptions", () => {
            expect(isCategorizeOptions(undefined)).toBeFalsy();
        });

        test("Empty object is not a CategorizeOptions", () => {
            expect(isCategorizeOptions({})).toBeFalsy();
        });

        test("string is not a CategorizeOptions", () => {
            expect(isCategorizeOptions("hello")).toBeFalsy();
        });

        test("number is not a CategorizeOptions", () => {
            expect(isCategorizeOptions(123)).toBeFalsy();
        });

        test("CategorizeOptions is a CategorizeOptions", () => {
            const categorizeOptions = { categories: [] };
            expect(isCategorizeOptions(categorizeOptions)).toBeTruthy();
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
            const configuration = { interactor: {}, logger: {} };
            expect(isConfiguration(configuration)).toBeFalsy();
        });

        test("Configuration is an Configuration", () => {
            const configuration = {
                interactor: {
                    connector: {
                        type: "",
                        options: {
                            path: "",
                            dataKeys: {
                                date: "",
                                initiator: "",
                                purpose: "",
                                value: "",
                            },
                            columns: [],
                            dateFormat: "",
                        },
                    },
                    mutator: {
                        categories: [],
                    },
                    report: {
                        type: "",
                        options: {
                            categories: [],
                        },
                    },
                },
                logger: {},
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
});
