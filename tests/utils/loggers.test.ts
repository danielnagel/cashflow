import { LogLevel, LogType } from "../../src/types/enums";
import { formatDate } from "../../src/utils/dates";
import { isDirectory, isFile, loadFile } from "../../src/utils/files";
import { log } from "../../src/utils/loggers";
import { rmSync } from "fs";

describe("Test utils/loggers", () => {
    describe("Test function log, type console", () => {
        test("log 'TEST' to console", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                level: LogLevel.Error,
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
            const options: Log = {
                type: LogType.Console,
                level: LogLevel.Error,
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
            const options: Log = {
                type: LogType.Console,
                level: LogLevel.Error,
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
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Debug,
                allowedLogLevel: LogLevel.Info,
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log level is info, allowed log level is warn", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Info,
                allowedLogLevel: LogLevel.Warn,
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log level is warn, allowed log level is error", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Warn,
                allowedLogLevel: LogLevel.Error,
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            consoleLog.mockReset();
        });

        test("log 'TEST' to console, with other date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "",
                timeFormat: "HH:mm:ss",
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

        test("log 'TEST' to console, with another date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "yyyy",
                timeFormat: "HH:mm:ss",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${formatDate(new Date(), "yyyy HH:mm:ss")} {error} ${
                    options.message
                }`,
            );

            consoleLog.mockReset();
        });

        test("log 'TEST' to console, with invalid date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.Console,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "asdfasdf",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(1);
            expect(consoleLog).toBeCalledWith(
                `${new Date().toLocaleDateString()} {error} ${options.message}`,
            );

            consoleLog.mockReset();
        });
    });

    describe("Test function log, type file", () => {
        test("log 'TEST' to file", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: "TEST",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            const expected = `${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} ${options.message}\n`;
            const result = loadFile(
                __dirname +
                    `/samples/logs/${formatDate(new Date(), "yyyy-MM-dd")}.log`,
            );
            expect(result).toStrictEqual(expected);
        });

        test("log 'TEST2' to file 'test1', append log", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: "TEST2",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} TEST\n${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} ${options.message}\n`;
            const result = loadFile(
                __dirname +
                    `/samples/logs/${formatDate(new Date(), "yyyy-MM-dd")}.log`,
            );
            expect(result).toStrictEqual(expected);
        });

        test("log ApplicationError to file", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: { message: "TEST", source: "test" },
                fileName: "test2",
                path: __dirname + "/samples/logs/",
            };

            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} [test]: TEST\n`;
            const result = loadFile(__dirname + "/samples/logs/test2.log");
            expect(result).toStrictEqual(expected);
        });

        test("allowed log level is none", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: "TEST",
                allowedLogLevel: "none",
                fileName: "test3",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const result = loadFile(__dirname + "/samples/logs/test3.log");
            expect(result).toBeNull();
        });

        test("log level is debug, allowed log level is info", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Debug,
                allowedLogLevel: LogLevel.Info,
                fileName: "test4",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const result = loadFile(__dirname + "/samples/logs/test4.log");
            expect(result).toBeNull();
        });

        test("log level is info, allowed log level is warn", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Info,
                allowedLogLevel: LogLevel.Warn,
                fileName: "test5",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const result = loadFile(__dirname + "/samples/logs/test5.log");
            expect(result).toBeNull();
        });

        test("log level is warn, allowed log level is error", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Warn,
                allowedLogLevel: LogLevel.Error,
                fileName: "test6",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const result = loadFile(__dirname + "/samples/logs/test6.log");
            expect(result).toBeNull();
        });

        test("log 'TEST' to file, with other date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "",
                timeFormat: "HH:mm:ss",
                fileName: "test7",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${formatDate(new Date(), "HH:mm:ss")} {error} ${
                options.message
            }\n`;
            const result = loadFile(__dirname + "/samples/logs/test7.log");
            expect(result).toStrictEqual(expected);
        });

        test("log 'TEST' to file, with another date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "yyyy",
                timeFormat: "HH:mm:ss",
                fileName: "test77",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${formatDate(
                new Date(),
                "yyyy HH:mm:ss",
            )} {error} ${options.message}\n`;
            const result = loadFile(__dirname + "/samples/logs/test77.log");
            expect(result).toStrictEqual(expected);
        });

        test("log 'TEST' to file, with invalid date format", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                message: "TEST",
                level: LogLevel.Error,
                dateFormat: "asdfasdf",
                fileName: "test8",
                path: __dirname + "/samples/logs/",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${new Date().toLocaleDateString()} {error} ${
                options.message
            }\n`;
            const result = loadFile(__dirname + "/samples/logs/test8.log");
            expect(result).toStrictEqual(expected);
        });

        test("log 'TEST' to file, changed path", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: "TEST",
                path: __dirname + "/samples/logs",
                fileName: "test9",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);
            const expected = `${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} ${options.message}\n`;
            const result = loadFile(__dirname + "/samples/logs/test9.log");
            expect(result).toStrictEqual(expected);
        });

        test("log 'TEST' to file, default path", () => {
            const consoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => {});
            const options: Log = {
                type: LogType.File,
                level: LogLevel.Error,
                message: "TEST",
                fileName: "thisisatestlog",
            };
            log(options);
            expect(consoleLog).toBeCalledTimes(0);

            const expected = `${formatDate(
                new Date(),
                "dd.MM.yyyy HH:mm:ss",
            )} {error} ${options.message}\n`;
            const result = loadFile(`data/logs/${options.fileName}.log`);
            expect(result).toStrictEqual(expected);
        });

        afterAll(() => {
            if (isDirectory(__dirname + "/samples/logs")) {
                rmSync(__dirname + "/samples/logs", {
                    recursive: true,
                    force: true,
                });
            }
            if (isFile("data/logs/thisisatestlog.log")) {
                rmSync("data/logs/thisisatestlog.log");
            }
        });
    });
});
