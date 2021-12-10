import { getTimeStampFromTransaction, parseDateString, formatDate } from "../../src/utils/dates";

describe("Test utils/dates", () => {

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

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

    describe("Test function parseDateString", () => {

        test("Parse string '09.12.2021' to javascript date object", () => {
            expect(parseDateString("09.12.2021", "dd.MM.yyyy")).toStrictEqual(new Date(2021, 11, 9));
        });

        test("Parse string '09-12-2021' to javascript date object", () => {
            expect(parseDateString("09-12-2021", "dd-MM-yyyy")).toStrictEqual(new Date(2021, 11, 9));
        });

        test("Parse string '12/09/2021' to javascript date object", () => {
            expect(parseDateString("12/09/2021", "MM/dd/yyyy")).toStrictEqual(new Date(2021, 11, 9));
        });

        test("Parse string '34/34/2021' to null", () => {
            expect(parseDateString("34/34/2021", "MM/dd/yyyy")).toBeNull();
        });

        test("Return null on invalid date format", () => {
            expect(parseDateString("12/09/2021", "laskjdhf")).toBeNull();
        });

        test("Parse string '09.12.2021' to javascript date object, without dateFormat string", () => {
            expect(parseDateString("09.12.2021")).toStrictEqual(new Date(2021, 11, 9));
        });

        test("Parse string '09.12.2021' to javascript date object, with undefined dateFormat", () => {
            expect(parseDateString("09.12.2021", undefined)).toStrictEqual(new Date(2021, 11, 9));
        });

    });

    describe("Test function formatDate", () => {

        test("Parse javascript date object to string '09.12.2021'", () => {
            expect(formatDate(new Date(2021, 11, 9), "dd.MM.yyyy")).toBe("09.12.2021");
        });

        test("Parse javascript date object to string '09-12-2021'", () => {
            expect(formatDate(new Date(2021, 11, 9), "dd-MM-yyyy")).toBe("09-12-2021");
        });

        test("Parse javascript date object to string '12/09/2021'", () => {
            expect(formatDate(new Date(2021, 11, 9), "MM/dd/yyyy")).toBe("12/09/2021");
        });

        test("Return null on invalid date format", () => {
            expect(formatDate(new Date(2021, 11, 9), "laskjdhf")).toBeNull();
        });

        test("Parse javascript date object to string '09.12.2021', without dateFormat string", () => {
            expect(formatDate(new Date(2021, 11, 9))).toBe("09.12.2021");
        });

        test("Parse javascript date object to string '09.12.2021', with undefined dateFormat", () => {
            expect(formatDate(new Date(2021, 11, 9), undefined)).toBe("09.12.2021");
        });

    });

});
