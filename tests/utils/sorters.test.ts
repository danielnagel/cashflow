import { sortTransactionsByDate } from "../../src/utils/sorters";

describe("Test utils/sorters", () => {
    describe("Test function sortTransactionsByDate", () => {
        const unsortedTransactions: Transaction[] = [
            {
                date: new Date(2021, 9, 19),
                initiator: "Beef Burger Palace",
                purpose: "We hope that you had a beefy good time!",
                value: 49.55,
            },
            {
                date: new Date(2021, 8, 1),
                initiator: "Melon the Man",
                purpose: "Juicy Melons",
                value: 39.38,
            },
            {
                date: new Date(2021, 10, 11),
                initiator: "Presentable Presents",
                purpose: "Good luck!",
                value: 199.78,
            },
            {
                date: new Date(2021, 5, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 5, 1),
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                date: new Date(2021, 6, 7),
                initiator: "Grocerie Land",
                purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                value: 109.56,
            },
            {
                date: new Date(2021, 8, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 8, 3),
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                date: new Date(2021, 7, 11),
                initiator: "Grocerie Land",
                purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                value: 88.86,
            },
            {
                date: new Date(2021, 7, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 7, 2),
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                date: new Date(2021, 9, 19),
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 19.10; TES710928476309298",
                value: 23.65,
            },
            {
                date: new Date(2021, 8, 21),
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 21.09;  TES710928476309298",
                value: 44.86,
            },
            {
                date: new Date(2021, 10, 22),
                initiator: "my-online-shop.com",
                purpose: "my-online-shop.com; 22.11;  TES710928476309298",
                value: 9.99,
            },
            {
                date: new Date(2021, 9, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 9, 1),
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                date: new Date(2021, 10, 10),
                initiator: "Tasty Deli and Grocerie Store",
                purpose: "Thanks for buying the freshest food",
                value: 65.49,
            },
            {
                date: new Date(2021, 10, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 10, 2),
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
            {
                date: new Date(2021, 6, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 6, 1),
                initiator: "Almost Healthy Inc.",
                purpose: "We bet that you're going to be sick",
                value: 12.99,
            },
            {
                date: new Date(2021, 11, 1),
                initiator: "Rent for my crib",
                purpose: "Thanks landlord",
                value: 650,
            },
            {
                date: new Date(2021, 11, 3),
                initiator: "Stay Healthy Corp.",
                purpose: "Your health is our mission",
                value: 14.99,
            },
        ];

        describe("Test sorting transactions by date", () => {
            const expected = [
                {
                    date: new Date(2021, 5, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 5, 1),
                    initiator: "Almost Healthy Inc.",
                    purpose: "We bet that you're going to be sick",
                    value: 12.99,
                },
                {
                    date: new Date(2021, 6, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 6, 1),
                    initiator: "Almost Healthy Inc.",
                    purpose: "We bet that you're going to be sick",
                    value: 12.99,
                },
                {
                    date: new Date(2021, 6, 7),
                    initiator: "Grocerie Land",
                    purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                    value: 109.56,
                },
                {
                    date: new Date(2021, 7, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 7, 2),
                    initiator: "Almost Healthy Inc.",
                    purpose: "We bet that you're going to be sick",
                    value: 12.99,
                },
                {
                    date: new Date(2021, 7, 11),
                    initiator: "Grocerie Land",
                    purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                    value: 88.86,
                },
                {
                    date: new Date(2021, 8, 1),
                    initiator: "Melon the Man",
                    purpose: "Juicy Melons",
                    value: 39.38,
                },
                {
                    date: new Date(2021, 8, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 8, 3),
                    initiator: "Stay Healthy Corp.",
                    purpose: "Your health is our mission",
                    value: 14.99,
                },
                {
                    date: new Date(2021, 8, 21),
                    initiator: "my-online-shop.com",
                    purpose: "my-online-shop.com; 21.09;  TES710928476309298",
                    value: 44.86,
                },
                {
                    date: new Date(2021, 9, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 9, 1),
                    initiator: "Stay Healthy Corp.",
                    purpose: "Your health is our mission",
                    value: 14.99,
                },
                {
                    date: new Date(2021, 9, 19),
                    initiator: "Beef Burger Palace",
                    purpose: "We hope that you had a beefy good time!",
                    value: 49.55,
                },
                {
                    date: new Date(2021, 9, 19),
                    initiator: "my-online-shop.com",
                    purpose: "my-online-shop.com; 19.10; TES710928476309298",
                    value: 23.65,
                },
                {
                    date: new Date(2021, 10, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 10, 2),
                    initiator: "Stay Healthy Corp.",
                    purpose: "Your health is our mission",
                    value: 14.99,
                },
                {
                    date: new Date(2021, 10, 10),
                    initiator: "Tasty Deli and Grocerie Store",
                    purpose: "Thanks for buying the freshest food",
                    value: 65.49,
                },
                {
                    date: new Date(2021, 10, 11),
                    initiator: "Presentable Presents",
                    purpose: "Good luck!",
                    value: 199.78,
                },
                {
                    date: new Date(2021, 10, 22),
                    initiator: "my-online-shop.com",
                    purpose: "my-online-shop.com; 22.11;  TES710928476309298",
                    value: 9.99,
                },
                {
                    date: new Date(2021, 11, 1),
                    initiator: "Rent for my crib",
                    purpose: "Thanks landlord",
                    value: 650,
                },
                {
                    date: new Date(2021, 11, 3),
                    initiator: "Stay Healthy Corp.",
                    purpose: "Your health is our mission",
                    value: 14.99,
                },
            ];

            test("Test sorting transaction by date; ascending", () => {
                const copyOfUnsortedTransactions = [...unsortedTransactions];
                sortTransactionsByDate(copyOfUnsortedTransactions);
                expect(copyOfUnsortedTransactions).toStrictEqual(expected);
            });

            test("Test sorting transaction by date; descending", () => {
                const copyOfUnsortedTransactions = [...unsortedTransactions];
                sortTransactionsByDate(copyOfUnsortedTransactions, true);
                expect(copyOfUnsortedTransactions).toStrictEqual(
                    expected.reverse(),
                );
            });
        });
    });
});
