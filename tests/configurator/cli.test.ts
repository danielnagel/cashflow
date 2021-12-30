import { processCliOptions } from "../../src/configurator/cli";

describe("Test configurator/cli", () => {
    describe("Process cli options", () => {
        afterEach(() => {
            process.argv = ["node", "jest"];
        });

        test("Default arguments, when no arguments where given", () => {
            expect(processCliOptions()).toStrictEqual({
                report: undefined,
                trendType: undefined,
                configurationPath: "data/config.json",
            });
        });

        test("Report option", () => {
            process.argv.push("-r");
            process.argv.push("trend");

            expect(processCliOptions()).toStrictEqual({
                report: "trend",
                trendType: undefined,
                configurationPath: "data/config.json",
            });
        });

        test("Trend type option", () => {
            process.argv.push("-t");
            process.argv.push("variable");

            expect(processCliOptions()).toStrictEqual({
                report: undefined,
                trendType: "variable",
                configurationPath: "data/config.json",
            });
        });

        test("Configuration path option", () => {
            process.argv.push("-c");
            process.argv.push("my/path/to/some/where/hello.json");

            expect(processCliOptions()).toStrictEqual({
                report: undefined,
                trendType: undefined,
                configurationPath: "my/path/to/some/where/hello.json",
            });
        });

        test("All options", () => {
            process.argv.push("-r");
            process.argv.push("trend");
            process.argv.push("-t");
            process.argv.push("variable");
            process.argv.push("-c");
            process.argv.push("my/path/to/some/where/hello.json");

            expect(processCliOptions()).toStrictEqual({
                report: "trend",
                trendType: "variable",
                configurationPath: "my/path/to/some/where/hello.json",
            });
        });
    });
});
