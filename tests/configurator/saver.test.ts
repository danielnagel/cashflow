import { loadConfigurationFile } from "../../src/configurator/loader";
import {
    exampleConfiguration,
    saveConfigurationFile,
} from "../../src/configurator/saver";
import { rmSync } from "fs";
import { isDirectory, isFile } from "../../src/utils/files";

describe("Test configurator/saver", () => {
    describe("Save configuration file", () => {
        const minimalConfiguration: Configuration = {
            report: "",
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
        test("ApplicationError, when path doesn't exist.", () => {
            expect(
                saveConfigurationFile(
                    minimalConfiguration,
                    __dirname + "/samples/blub",
                ),
            ).toStrictEqual({
                source: "saver.ts",
                message: `Path "${
                    __dirname + "/samples/blub"
                }" does not exist.`,
            });
        });

        test("Save file with minimal Configuration object.", () => {
            saveConfigurationFile(minimalConfiguration, __dirname + "/samples");
            expect(
                loadConfigurationFile(__dirname + "/samples/config.json"),
            ).toStrictEqual(minimalConfiguration);
        });

        test("Save file with minimal Configuration object, changed name", () => {
            saveConfigurationFile(
                minimalConfiguration,
                __dirname + "/samples",
                false,
                "test",
            );
            expect(
                loadConfigurationFile(__dirname + "/samples/test.json"),
            ).toStrictEqual(minimalConfiguration);
        });

        test("ApplicationError when file exists", () => {
            const copyOfMinimalConfiguration = { ...minimalConfiguration };
            copyOfMinimalConfiguration.source = {
                ...minimalConfiguration.source,
            };
            copyOfMinimalConfiguration.report = "test";
            expect(
                saveConfigurationFile(
                    copyOfMinimalConfiguration,
                    __dirname + "/samples",
                ),
            ).toStrictEqual({
                source: "saver.ts",
                message: `File "${
                    __dirname + "/samples/config.json"
                }" already exists.`,
            });
        });

        test("Override file with force = true", () => {
            const copyOfMinimalConfiguration = { ...minimalConfiguration };
            copyOfMinimalConfiguration.source = {
                ...minimalConfiguration.source,
            };
            copyOfMinimalConfiguration.report = "test";
            saveConfigurationFile(
                copyOfMinimalConfiguration,
                __dirname + "/samples",
                true,
            );
            expect(
                loadConfigurationFile(__dirname + "/samples/config.json"),
            ).toStrictEqual(copyOfMinimalConfiguration);
        });

        test("Save file in a non existent directory, when force is true", () => {
            saveConfigurationFile(
                minimalConfiguration,
                __dirname + "/samples/data",
                true,
            );
            expect(
                loadConfigurationFile(__dirname + "/samples/data/config.json"),
            ).toStrictEqual(minimalConfiguration);
        });

        test("Save file in a non existent directory, when force is true, changed name", () => {
            saveConfigurationFile(
                minimalConfiguration,
                __dirname + "/samples/data",
                true,
                "test",
            );
            expect(
                loadConfigurationFile(__dirname + "/samples/data/test.json"),
            ).toStrictEqual(minimalConfiguration);
        });

        test("Save example configuration file.", () => {
            saveConfigurationFile(
                exampleConfiguration,
                __dirname + "/samples/data",
                false,
                "example",
            );
            expect(
                loadConfigurationFile(__dirname + "/samples/data/example.json"),
            ).toStrictEqual(exampleConfiguration);
        });

        afterAll(() => {
            if (isDirectory(__dirname + "/samples/data")) {
                rmSync(__dirname + "/samples/data", {
                    recursive: true,
                    force: true,
                });
            }
            if (isFile(__dirname + "/samples/config.json"))
                rmSync(__dirname + "/samples/config.json");
            if (isFile(__dirname + "/samples/test.json"))
                rmSync(__dirname + "/samples/test.json");
        });
    });
});
