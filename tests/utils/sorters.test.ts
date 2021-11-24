import { sortTransactionsByDate } from "../../src/utils/sorters";


describe("Test utils/sorters", () => {

    describe("Test function sortTransactionsByDate", () => {

        const unsortedTransactions: Transaction[] = [
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
            { day: 21, month: 9, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 21.09;  TES710928476309298", value: 44.86 },
            { day: 22, month: 11, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 22.11;  TES710928476309298", value: 9.99 },
            { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            { day: 10, month: 11, year: 2021, initiator: "Tasty Deli and Grocerie Store", purpose: "Thanks for buying the freshest food", value: 65.49 },
            { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
            { day: 1, month: 12, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
            { day: 3, month: 12, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
        ];

        describe("Test sorting transactions by date", () => {

            const expected = [
                { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
                { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
                { day: 1, month: 9, year: 2021, initiator: "Melon the Man", purpose: "Juicy Melons", value: 39.38 },
                { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                { day: 21, month: 9, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 21.09;  TES710928476309298", value: 44.86 },
                { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                { day: 19, month: 10, year: 2021, initiator: "Beef Burger Palace", purpose: "We hope that you had a beefy good time!", value: 49.55 },
                { day: 19, month: 10, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 19.10; TES710928476309298", value: 23.65 },
                { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                { day: 10, month: 11, year: 2021, initiator: "Tasty Deli and Grocerie Store", purpose: "Thanks for buying the freshest food", value: 65.49 },
                { day: 11, month: 11, year: 2021, initiator: "Presentable Presents", purpose: "Good luck!", value: 199.78 },
                { day: 22, month: 11, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 22.11;  TES710928476309298", value: 9.99 },
                { day: 1, month: 12, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                { day: 3, month: 12, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
            ];

            test("Test sorting transaction by date; ascending", () => {
                const copyOfUnsortedTransactions = [...unsortedTransactions];
                sortTransactionsByDate(copyOfUnsortedTransactions);
                expect(copyOfUnsortedTransactions).toStrictEqual(expected);
            });

            test("Test sorting transaction by date; descending", () => {
                const copyOfUnsortedTransactions = [...unsortedTransactions];
                sortTransactionsByDate(copyOfUnsortedTransactions, true);
                expect(copyOfUnsortedTransactions).toStrictEqual(expected.reverse());
            });
        });

    });

});