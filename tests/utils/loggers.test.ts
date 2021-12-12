import { formatDate } from "../../src/utils/dates";
import { log } from "../../src/utils/loggers";

describe("Test utils/loggers", () => {
    describe("Test function log, type console", () => {
        test("log 'TEST' to console", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${formatDate(new Date(), "dd.MM.yyyy HH:mm:ss")} {error} ${
                    options.message
                }`,
            );

            consoleLog.mockReset();
        });

        test("log ApplicationError to console", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: { message: "TEST", source: "test" },
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${formatDate(
                    new Date(),
                    "dd.MM.yyyy HH:mm:ss",
                )} {error} [test]: TEST`,
            );

            consoleLog.mockReset();
        });

        test("allowed log level is none", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                allowedLogLevel: "none",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log level is debug, allowed log level is info", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                level: "debug",
                allowedLogLevel: "info",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log level is info, allowed log level is warn", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                level: "info",
                allowedLogLevel: "warn",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log level is warn, allowed log level is error", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                level: "warn",
                allowedLogLevel: "error",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log 'TEST' to console, with other date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                dateTimeFormat: "HH:mm:ss",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${formatDate(new Date(), "HH:mm:ss")} {error} ${
                    options.message
                }`,
            );

            consoleLog.mockReset();
        });

        test("log 'TEST' to console, with invalid date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: LogOptions = {
                type: "console",
                message: "TEST",
                dateTimeFormat: "asdfasdf",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${new Date().toLocaleDateString()} {error} ${options.message}`,
            );

            consoleLog.mockReset();
        });
    });
});
