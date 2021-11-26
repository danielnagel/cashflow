import { generateFixCost, generateCategorizedFixCosts } from "../../src/interactor/fixCostsReport";

describe("Test fixCostReport", () => {
    const transactions: Transaction[] = [
        { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
        { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
        { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
        { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
        { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
        { day: 11, month: 8, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 88.86 },
        { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
        { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
        { day: 22, month: 10, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: 39.99 },
        { day: 19, month: 10, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 19.10; TES710928476309298", value: 23.65 },
        { day: 7, month: 7, year: 2021, initiator: "Grocerie Land", purpose: "VISA 23 GROCERIE LAND TES71234123423134", value: 109.56 },
        { day: 21, month: 9, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 21.09;  TES710928476309298", value: 44.86 },
        { day: 22, month: 9, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: 39.99 },
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
        { day: 19, month: 10, year: 2021, initiator: "my-online-shop.com", purpose: "my-online-shop.com; 19.10; TES710928476309298", value: 23.65 },
        { day: 15, month: 9, year: 2021, initiator: "Grocerie Land", purpose: "VISA 11 GROCERIE LAND TES71234123423134", value: 99.99 },
        { day: 22, month: 11, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: 39.99 },
        { day: 20, month: 8, year: 2021, initiator: "cool-gadgets.com", purpose: "cool-gadgets.com.com; 20.08;  TES710919287369187", value: 18.45 }
    ];

    describe("Test function generateFixCost", () => {

        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
                const fixCost = generateFixCost([], { samples: ["test"], before: new Date(2021, 11, 15).getTime() });

                expect(fixCost).toBeNull();
            });

            const transactions: Transaction[] = [
                { day: 19, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 23.65 },
            ];

            test("Return null, if samples array is empty", () => {
                const fixCost = generateFixCost(transactions, { samples: [], before: new Date(2021, 11, 15).getTime() });

                expect(fixCost).toBeNull();
            });

            test("Return null, if there aren't any transactions that match toDate", () => {
                const fixCost = generateFixCost(transactions, { samples: ["Rent for my crib"], before: new Date(1999, 11, 15).getTime() });

                expect(fixCost).toBeNull();
            });

            test("Return null, if sinceDate is after toDate", () => {
                const fixCost = generateFixCost(transactions, { samples: ["Rent for my crib"], before: new Date(1999, 11, 15).getTime(), after: new Date(2002, 6, 12).getTime() });

                expect(fixCost).toBeNull();
            });

            test("Return null, if no transaction is matching", () => {
                const fixCost = generateFixCost(transactions, { samples: ["Rent for my crib?"], before: new Date(2021, 11, 30).getTime() });

                expect(fixCost).toBeNull();
            });
        });

        describe("Test fix costs to match exactly one interactor (sample), same booking day, unsorted transactions", () => {

            const samples = ["Rent for my crib"];

            test("Generate fix cost as expected", () => {
                const expected: FixCost = {
                    value: 650, isPaidThisMonth: true, lastBookingDays: [1, 1, 1, 1, 1, 1], averageBookingDay: 1, transactions: [
                        { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 10, 30).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });


            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixCost = {
                    value: 650, isPaidThisMonth: true, lastBookingDays: [1, 1, 1, 1, 1], averageBookingDay: 1, transactions: [
                        { day: 1, month: 6, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 7, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 8, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 9, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 9, 15).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixCost = {
                    value: 650, isPaidThisMonth: true, lastBookingDays: [1, 1], averageBookingDay: 1, transactions: [
                        { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                        { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 10, 15).getTime(), after: new Date(2021, 8, 1).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });
        });

        describe("Test fix costs to match multiple interactors (samples), which are the same fix cost, but the interactor name changes; different booking days", () => {

            const samples = ["Stay Healthy Corp.", "Almost Healthy Inc."];

            test("Generate fix cost as expected", () => {
                const expected: FixCost = {
                    value: 14.99, isPaidThisMonth: true, lastBookingDays: [1, 1, 2, 3, 1, 2, 3], averageBookingDay: 1, transactions: [
                        { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                        { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                        { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                        { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                        { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                        { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                        { day: 3, month: 12, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 11, 30).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });


            test("Generate fix cost as expected, toDate before latest transaction that matches sample", () => {
                const expected: FixCost = {
                    value: 12.99, isPaidThisMonth: false, lastBookingDays: [1, 1, 2], averageBookingDay: 1, transactions: [
                        { day: 1, month: 6, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                        { day: 1, month: 7, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                        { day: 2, month: 8, year: 2021, initiator: "Almost Healthy Inc.", purpose: "We bet that you're going to be sick", value: 12.99 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 8, 1).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });

            test("Generate fix cost as expected, with since Date", () => {
                const expected: FixCost = {
                    value: 14.99, isPaidThisMonth: true, lastBookingDays: [3, 1, 2], averageBookingDay: 2, transactions: [
                        { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                        { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                        { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                    ]
                };

                const fixCost = generateFixCost(transactions, { samples, before: new Date(2021, 10, 15).getTime(), after: new Date(2021, 8, 1).getTime() });

                expect(fixCost).toStrictEqual(expected);
            });
        });

    });

    describe("Test categorized fix costs", () => {

        describe("Test falsy parameters", () => {
            test("Return null, if transactions array is empty", () => {
                const options: CategorizeOptions = { categories: [{ name: "a", samples: ["b", "c"] }] };
                expect(generateCategorizedFixCosts([], options)).toBeNull();
            });

            const transactions: Transaction[] = [
                { day: 19, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 23.65 },
            ];

            test("Return null, if categories array is empty", () => {
                const options: CategorizeOptions = { categories: [] };
                expect(generateCategorizedFixCosts(transactions, options)).toBeNull();
            });

            test("Return null, if no transaction can be categorized", () => {
                const options: CategorizeOptions = { categories: [{ name: "a", samples: ["b", "c"] }] };
                expect(generateCategorizedFixCosts(transactions, options)).toBeNull();;
            });
        });

        describe("Test categorized fix costs to match multiple categories to a specific date", () => {

            test("Generate categorized fix costs as expected", () => {

                const expected: CategorizedFixCosts = {
                    date: new Date(2021, 10, 15).getTime(),
                    sum: 704.98,
                    unpaidSum: 39.99,
                    fixCosts: [
                        {
                            name: "rent", fixCost: {
                                value: 650, isPaidThisMonth: true, lastBookingDays: [1, 1], averageBookingDay: 1, transactions: [
                                    { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                                    { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: 650 },
                                ]
                            }
                        },
                        {
                            name: "insurance", fixCost: {
                                value: 14.99, isPaidThisMonth: true, lastBookingDays: [3, 1, 2], averageBookingDay: 2, transactions: [
                                    { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                                    { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                                    { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: 14.99 },
                                ]
                            }
                        },
                        {
                            name: "mobile", fixCost: {
                                value: 39.99, isPaidThisMonth: false, lastBookingDays: [22, 22], averageBookingDay: 22, transactions: [
                                    { day: 22, month: 9, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: 39.99 },
                                    { day: 22, month: 10, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: 39.99 },
                                ]
                            }
                        }
                    ]
                };

                const options: CategorizeOptions = {
                    before: new Date(2021, 10, 15).getTime(), after: new Date(2021, 8, 1).getTime(),
                    categories: [
                        { name: "rent", samples: ["Rent for my crib"] },
                        { name: "insurance", samples: ["Stay Healthy Corp."] },
                        { name: "mobile", samples: ["Mobilio Ltd."] },
                    ]
                }

                expect(generateCategorizedFixCosts(transactions, options)).toStrictEqual(expected);
            });
        });
    });

    describe("Test variable costs for one sample", () => { });
});


// 1 --- generate fix costs report --- fixCostReport.ts
// generate a timestamp that is the last transaction date - 1 day
// --- generate single fix costs for one category ---
// special handling for non-monthly, e.g. quarter yearly, fix costs

// 2 --- interactor.ts ---
// generate fix costs report from sample csv data

// 3 --- generate trend report ---

// --- create categorized transaction ---
// create a categorized transaction from a list of transactions
// return empty list when there are no samples
// return empty list when there is no transaction type specified
// --- GENERATE CATEGORIZED TRANSACTIONS ---
// generate all categorized transactions from transaction data
// return empty list when there is no data