import { loadConfigurationFile } from "../../src/configurator/loader";

describe("Test configurator/loader", () => {

    describe("Load configuration file", () => {

        test("File isn't a configuration file, if it doesn't exist.", () => {
            expect(loadConfigurationFile(__dirname + "/samples/blub")).toBeNull();
        });

        test("File isn't a configuration file, if it's content can't be parsed to a javascript object.", () => {
            expect(loadConfigurationFile(__dirname + "/samples/malformedConfig.txt")).toBeNull();
        })

        test("File isn't a configuration file, if it's content isn't from correct type.", () => {
            expect(loadConfigurationFile(__dirname + "/samples/config1.json")).toBeNull();
        })

        test("File is a configuration file, if it's content is a InteractorOptions object.", () => {
            const expected = {
                connector: {
                    type: "",
                    options: {
                        path: "",
                        dataKeys: { date: "", initiator: "", purpose: "", value: "" },
                        columns: []
                    }
                },
                report: {
                    type: "",
                    options: {
                        before: "", after: "",
                        categories: []
                    }
                }
            };
            expect(loadConfigurationFile(__dirname + "/samples/config2.json")).toStrictEqual(expected);
        });

    });

});

// --- SAVER ---
// persist command line options as configuration file
// Generate example configuration file