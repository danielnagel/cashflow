import {
    decimalNumberToFloat,
    germanDecimalNumberToFloat,
    round,
} from "../../src/utils/numbers";

describe("Test utils/numbers", () => {
    describe("Test function germanDecimalNumberToFloat", () => {
        test("Parse '1,23' to 1.23", () => {
            expect(germanDecimalNumberToFloat("1,23")).toBe(1.23);
        });

        test("Parse '1.234,56' to 1234.56", () => {
            expect(germanDecimalNumberToFloat("1.234,56")).toBe(1234.56);
        });

        test("Parse '1.23' to NaN", () => {
            expect(germanDecimalNumberToFloat("1.23")).toBe(NaN);
        });

        test("Parse '1.O1' to be NaN", () => {
            expect(germanDecimalNumberToFloat("1.O1")).toBe(NaN);
        });
    });

    describe("Test function decimalNumberToFloat", () => {
        test("Parse '1,23' to NaN", () => {
            expect(decimalNumberToFloat("1,23")).toBe(NaN);
        });

        test("Parse '1.234,56' to NaN", () => {
            expect(decimalNumberToFloat("1.234,56")).toBe(NaN);
        });

        test("Parse '1.23' to 1.23", () => {
            expect(decimalNumberToFloat("1.23")).toBe(1.23);
        });

        test("Parse '1.O1' to be NaN", () => {
            expect(decimalNumberToFloat("1.O1")).toBe(NaN);
        });
    });

    describe("Test function round", () => {
        test("Round 1234 to '1234.00'", () => {
            expect(round(1234)).toBe("1234.00");
        });

        test("Round 1234.56789 to '1234.57'", () => {
            expect(round(1234.56789)).toBe("1234.57");
        });

        test("Round 1234.56789 to '1234,57' with delimiter ','", () => {
            expect(round(1234.56789, ",")).toBe("1234,57");
        });
    });
});
