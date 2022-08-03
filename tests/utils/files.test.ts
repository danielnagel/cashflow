import {
    pathExists,
    loadFile,
    loadFileNamesFromDirectory,
    isFile,
    isDirectory,
    createDirectory,
    saveFile,
    createFilePath,
    appendFile,
} from "../../src/utils/files";
import { rmSync } from "fs";

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
            expect(fileNames).toHaveLength(4);
            expect(fileNames[0]).toBe("expected.ts");
            expect(fileNames[1]).toBe("sample1.txt");
            expect(fileNames[2]).toBe("sample2.csv");
            expect(fileNames[3]).toBe("transactions.ts");
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

    describe("Create directory", () => {
        test("Create a directory", () => {
            const path = __dirname + "/samples/test";
            expect(isDirectory(path)).toBeFalsy();
            expect(createDirectory(path)).toBeTruthy();
            expect(isDirectory(path)).toBeTruthy();
        });

        test("Don't create a directory, when it already exists", () => {
            const path = __dirname + "/samples/test";
            expect(isDirectory(path)).toBeTruthy();
            expect(createDirectory(path)).toBeFalsy();
        });
    });

    describe("Save file", () => {
        test("Save a file", () => {
            const path = __dirname + "/samples/test/test.txt";
            expect(isFile(path)).toBeFalsy();
            saveFile("test", path);
            expect(loadFile(path)).toBe("test");
        });

        test("Override a file", () => {
            const path = __dirname + "/samples/test/test.txt";
            expect(isFile(path)).toBeTruthy();
            saveFile("test123", path);
            expect(loadFile(path)).toBe("test123");
        });
    });

    describe("Append file", () => {
        test("Append a file", () => {
            const path = __dirname + "/samples/test/test2.txt";
            expect(isFile(path)).toBeFalsy();
            appendFile("test", path);
            expect(loadFile(path)).toBe("test");
        });

        test("Append a file", () => {
            const path = __dirname + "/samples/test/test2.txt";
            expect(isFile(path)).toBeTruthy();
            appendFile("test123", path);
            expect(loadFile(path)).toBe("testtest123");
        });
    });

    describe("Create file path", () => {
        test("Create path with ending /", () => {
            const path = "/samples/test/";
            const fileName = "test.txt";
            const expected = `${path}${fileName}`;
            expect(createFilePath(path, fileName)).toBe(expected);
        });

        test("Create path without ending /", () => {
            const path = "/samples/test";
            const fileName = "test.txt";
            const expected = `${path}/${fileName}`;
            expect(createFilePath(path, fileName)).toBe(expected);
        });

        test("Return null if path parameter is less than one character", () => {
            const path = "";
            const fileName = "test.txt";
            expect(createFilePath(path, fileName)).toBeNull();
        });

        test("Return null if fileName parameter is less than one character", () => {
            const path = "/samples/test";
            const fileName = "";
            expect(createFilePath(path, fileName)).toBeNull();
        });
    });

    afterAll(() => {
        if (isDirectory(__dirname + "/samples/test")) {
            rmSync(__dirname + "/samples/test", {
                recursive: true,
                force: true,
            });
        }
    });
});
