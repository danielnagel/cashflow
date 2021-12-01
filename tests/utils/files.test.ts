import { fileExists } from "../../src/utils/files";

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

});