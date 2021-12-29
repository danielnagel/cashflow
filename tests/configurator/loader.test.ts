import { loadConfigurationFile } from "../../src/configurator/loader";

describe("Test configurator/loader", () => {
    describe("Load configuration file", () => {
        test("File isn't a configuration file, if it doesn't exist.", () => {
            expect(
                loadConfigurationFile(__dirname + "/samples/blub"),
            ).toStrictEqual({
                source: "loader.ts",
                message: `Configuration file "${
                    __dirname + "/samples/blub"
                }", was not found.`,
            });
        });

        test("File isn't a configuration file, if it's content can't be parsed to a javascript object.", () => {
            expect(
                loadConfigurationFile(
                    __dirname + "/samples/malformedConfig.txt",
                ),
            ).toStrictEqual({
                source: "loader.ts",
                message: `Configuration file "${
                    __dirname + "/samples/malformedConfig.txt"
                }", couldn't be parsed.`,
            });
        });

        test("File isn't a configuration file, if it's content isn't from correct type.", () => {
            expect(
                loadConfigurationFile(__dirname + "/samples/config1.json"),
            ).toStrictEqual({
                source: "loader.ts",
                message: `Configuration file "${
                    __dirname + "/samples/config1.json"
                }", has the wrong format.`,
            });
        });

        test("File is a configuration file, if it's content is a minimal Configuration object.", () => {
            const expected = {
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
            expect(
                loadConfigurationFile(__dirname + "/samples/config2.json"),
            ).toStrictEqual(expected);
        });
    });
});
