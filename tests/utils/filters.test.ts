import { filterTransactions } from "../../src/utils/filters";

describe("Test utils/filters", () => {

    describe("Test function filterTransactions", () => {

        const transactions: Transaction[] = [
            { day: 19, month: 10, year: 2021, initiator: "Beef Burger Palace", purpose: "We hope that you had a beefy good time!", value: 49.55 },
            { day: 1, month: 9, year: 2021, initiator: "Melon the Man", purpose: "Juicy Melons", value: 39.38 },
            { day: 11, month: 11, year: 2021, initiator: "Presentable Presents", purpose: "Good luck!", value: 199.78 },
            { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
            { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
            { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
            { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
            { day: 19, month: 10, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 19.10; TES710928476309298", value: 23.65 },
            { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
            { day: 21, month: 9, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 21.09;  TES710928476309298", value: 44.86 },
            { day: 22, month: 11, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 22.11;  TES710928476309298", value: 9.99 },
            { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            { day: 10, month: 11, year: 2021, initiator: "Tasty Deli and Grocerie Store", purpose: "Thanks for buying the freshest food", value: 65.49 },
            { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
            { day: 10, month: 11, year: 2021, initiator: "Tasty Deli and Grocerie Store", purpose: "Thanks for buying the freshest food", value: 65.49 },
            { day: 1, month: 12, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 3, month: 12, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
        ];

        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                expect(filterTransactions([], { samples: ["test"], before: new Date(2021, 11, 15).getTime() })).toHaveLength(0);
            });

            test("Return an array of length 0, if samples option is empty", () => {
                expect(filterTransactions(transactions, { samples: [], before: new Date(2021, 11, 15).getTime() })).toHaveLength(0);
            });

            test("Return an array of length 0, if there aren't any transactions that match 'before date' option", () => {
                expect(filterTransactions(transactions, { samples: ["Rent for my crib"], before: new Date(1999, 11, 15).getTime() })).toHaveLength(0);
            });

            test("Return an array of length 0, if 'before date' is after 'after date' option", () => {
                expect(filterTransactions(transactions, { samples: ["Rent for my crib"], before: new Date(1999, 11, 15).getTime(), after: new Date(2002, 6, 12).getTime() })).toHaveLength(0);
            });

            test("Return an array of length 0, if no transaction is matching", () => {
                expect(filterTransactions(transactions, { samples: ["Wizard from Oz"], before: new Date(2021, 11, 15).getTime() })).toHaveLength(0);
            });
        });

        describe("Test filtering transactions by exactly one sample", () => {

            const samples = ["Rent for my crib"];

            test("Filter transactions until 'before date' ", () => {
                const expected = [
                    { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                ]

                const filteredTransactions = filterTransactions(transactions, { samples, before: new Date(2021, 10, 30).getTime() });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from 'before date' to 'after date'", () => {
                const expected = [
                    { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                ];

                const filteredTransactions = filterTransactions(transactions, { samples, before: new Date(2021, 10, 15).getTime(), after: new Date(2021, 7, 31).getTime() });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions without date limitation", () => {
                const expected = [
                    { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    { day: 1, month: 12, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                ];

                const filteredTransactions = filterTransactions(transactions, { samples });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });
        });

        describe("Test filtering transactions by multiple samples", () => {
            const samples = ["Beef Burger Palace", "Almost Healthy Inc.", "Grocerie Land"];

            test("Filter transactions until specific to date", () => {
                const expected = [
                    { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                    { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                ]

                const filteredTransactions = filterTransactions(transactions, { samples, before: new Date(2021, 9, 1).getTime() });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions from specific to date to specific since date", () => {
                const expected = [
                    { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                    { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                ];

                const filteredTransactions = filterTransactions(transactions, { samples, before: new Date(2021, 9, 1).getTime(), after: new Date(2021, 6, 5).getTime() });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });

            test("Filter transactions without date limitation", () => {
                const expected = [
                    { day: 19, month: 10, year: 2021, initiator: "Beef Burger Palace", purpose: "We hope that you had a beefy good time!", value: 49.55 },
                    { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                    { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
                    { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                ];

                const filteredTransactions = filterTransactions(transactions, { samples });
                expect(filteredTransactions).toHaveLength(expected.length);
                expect(filteredTransactions).toStrictEqual(expected);
            });
        });

    });

});