import { germanDecimalNumberToFloat } from "../../src/utils/numbers";

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

});
