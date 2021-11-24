import { getTimeStampFromTransaction } from "../../src/utils/dates";

describe("Test utils/dates", () => {

    describe("Test function getTimeStampFromTransaction", () => {

        test("Parse 19.10.2021 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 19, month: 10, year: 2021, initiator: "", purpose: "", value: 0 })).toBe(new Date(2021, 9, 19).getTime());
        });

        test("Parse 1.6.2021 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 1, month: 6, year: 2021, initiator: "", purpose: "", value: 0 })).toBe(new Date(2021, 5, 1).getTime());
        });

        test("Parse 31.12.2021 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 31, month: 12, year: 2021, initiator: "", purpose: "", value: 0 })).toBe(new Date(2021, 11, 31).getTime());
        });

        test("Parse 10.10.2023 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 10, month: 10, year: 2023, initiator: "", purpose: "", value: 0 })).toBe(new Date(2023, 9, 10).getTime());
        });

        test("Parse 1.1.2010 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 1, month: 1, year: 2010, initiator: "", purpose: "", value: 0 })).toBe(new Date(2010, 0, 1).getTime());
        });

        test("Parse 0.0.0 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: 0, month: 0, year: 0, initiator: "", purpose: "", value: 0 })).toBe(new Date(0, -1, 0).getTime());
        });

        test("Parse -1.-1.-2010 from transaction to expected timestamp", () => {
            expect(getTimeStampFromTransaction({ day: -1, month: -1, year: -2010, initiator: "", purpose: "", value: 0 })).toBe(new Date(-2010, -2, -1).getTime());
        });

    });

});
