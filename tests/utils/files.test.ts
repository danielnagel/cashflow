import { fileExists, loadFile } from "../../src/utils/files";

describe("Test utils/files", () => {

    describe("Check if files exist", () => {
        test("True if files exist", () => {
            expect(fileExists(__dirname + "/samples/sample1.txt")).toBeTruthy();
        });
        test("False if files do not exist", () => {
            expect(fileExists(__dirname + "/samples/sample1.csv")).toBeFalsy();
        });
        test("False if path string empty", () => {
            expect(fileExists("")).toBeFalsy();
        });
    });
    
    describe("Load file", () => {
        test("Return null if file does not exist", () => {
            expect(loadFile(__dirname + "/samples/sample1.csv")).toBeNull();
        });

        test("Load expected string from file", () => {
            expect(loadFile(__dirname + "/samples/sample1.txt")).toBe("hello world");
        });
    });

});