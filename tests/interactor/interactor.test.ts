import { generateReport } from "src/interactor/interactor";

describe("Test Interactor", () => {

    describe("Test generating reports with CSV connector", () => {

        describe("Generate categorized fix costs from samples", () => {

            test("Generate categorized fix costs as expected", async () => {
                const expected: CategorizedFixCosts = {
                    date: new Date(2021, 10, 15).getTime(),
                    sum: -704.98,
                    unpaidSum: -39.99,
                    fixCosts: [
                        {
                            name: "rent", fixCost: {
                                value: -650, isPaidThisMonth: true, lastBookingDays: [1, 1], averageBookingDay: 1, transactions: [
                                    { day: 1, month: 10, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: -650 },
                                    { day: 1, month: 11, year: 2021, initiator: "Rent for my crib", purpose: "Thanks landlord", value: -650 },
                                ]
                            }
                        },
                        {
                            name: "insurance", fixCost: {
                                value: -14.99, isPaidThisMonth: true, lastBookingDays: [3, 1, 2], averageBookingDay: 2, transactions: [
                                    { day: 3, month: 9, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: -14.99 },
                                    { day: 1, month: 10, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: -14.99 },
                                    { day: 2, month: 11, year: 2021, initiator: "Stay Healthy Corp.", purpose: "Your health is our mission", value: -14.99 },
                                ]
                            }
                        },
                        {
                            name: "mobile", fixCost: {
                                value: -39.99, isPaidThisMonth: false, lastBookingDays: [22, 22], averageBookingDay: 22, transactions: [
                                    { day: 22, month: 9, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: -39.99 },
                                    { day: 22, month: 10, year: 2021, initiator: "Mobilio Ltd.", purpose: "your mobile phone provider", value: -39.99 },
                                ]
                            }
                        }
                    ]
                };

                const options: InteractorOptions = {
                    connector: {
                        type: "csv",
                        options: {
                            path: __dirname + "/samples/sample1.csv",
                            dataKeys: { date: "booking", initiator: "initiator", purpose: "use", value: "amount" },
                            columns: ["booking", "valuta", "initiator", "bookingtext", "randominformation", "use", "balance", "currency", "amount", "currency"] }
                    },
                    report: {
                        type: "fixcosts",
                        options: {
                            before: new Date(2021, 10, 15).getTime(), after: new Date(2021, 8, 1).getTime(),
                            categories: [
                                { name: "rent", samples: ["Rent for my crib"] },
                                { name: "insurance", samples: ["Stay Healthy Corp."] },
                                { name: "mobile", samples: ["Mobilio Ltd."] },
                            ]
                        }
                    }
                };

                expect(await generateReport(options)).toStrictEqual(expected);
            });

        });

    });

});