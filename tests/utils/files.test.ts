import {
    pathExists,
    loadFile,
    loadFileNamesFromDirectory,
    isFile,
    isDirectory,
} from "../../src/utils/files";

describe("Test utils/files", () => {
    describe("Check if files exist", () => {
        test("file exists", () => {
            expect(pathExists(__dirname + "/samples/sample1.txt")).toBeTruthy();
        });

        test("file does not exist", () => {
            expect(pathExists(__dirname + "/samples/sample1.csv")).toBeFalsy();
        });

        test("path is empty", () => {
            expect(pathExists("")).toBeFalsy();
        });

        test("path is directory", () => {
            expect(pathExists(__dirname + "/samples")).toBeTruthy();
        });
    });

    describe("Check if is file", () => {
        test("file exists and is file", () => {
            expect(isFile(__dirname + "/samples/sample1.txt")).toBeTruthy();
        });

        test("file does not exist", () => {
            expect(isFile(__dirname + "/samples/sample1.csv")).toBeFalsy();
        });

        test("directory exists and is not file", () => {
            expect(isFile(__dirname + "/samples")).toBeFalsy();
        });
    });

    describe("Check if is directory", () => {
        test("directory exists and is directory", () => {
            expect(isDirectory(__dirname + "/samples")).toBeTruthy();
        });

        test("directory does not exist", () => {
            expect(isDirectory(__dirname + "/samplesdoesnotexist")).toBeFalsy();
        });

        test("files exists, but is not a directory", () => {
            expect(isDirectory(__dirname + "/samples/sample1.txt")).toBeFalsy();
        });
    });

    describe("Load file", () => {
        test("Return null if file does not exist", () => {
            expect(loadFile(__dirname + "/samples/sample1.csv")).toBeNull();
        });

        test("Load expected string from file", () => {
            expect(loadFile(__dirname + "/samples/sample1.txt")).toBe(
                "hello world",
            );
        });
    });

    describe("Load files from directory", () => {
        test("Return emptyArray if directory does not exist", () => {
            expect(
                loadFileNamesFromDirectory(__dirname + "/notexisting"),
            ).toHaveLength(0);
        });

        test("Return emptyArray if directory is empty", () => {
            expect(
                loadFileNamesFromDirectory(__dirname + "/empty"),
            ).toHaveLength(0);
        });

        test("Load file names from directory", () => {
            const fileNames = loadFileNamesFromDirectory(
                __dirname + "/samples",
            );
            expect(fileNames).toHaveLength(3);
            expect(fileNames[0]).toBe("sample1.txt");
            expect(fileNames[1]).toBe("sample2.csv");
            expect(fileNames[2]).toBe("transactions.ts");
        });

        test("Load file names with specific file extension from directory", () => {
            const fileNames = loadFileNamesFromDirectory(
                __dirname + "/samples",
                "csv",
            );
            expect(fileNames).toHaveLength(1);
            expect(fileNames[0]).toBe("sample2.csv");
        });
    });
});
