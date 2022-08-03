export const fixedPayDayReport: ReportFixedPayDay = {
    type: "fixedpayday",
    sum: -704.98,
    unpaidSum: -39.99,
    namedFixedPayDays: [
        {
            name: "rent",
            fixedPayDay: {
                value: -650,
                isPaid: true,
                transactions: [
                    {
                        id: 0,
                        date: new Date(2021, 9, 1),
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: -650,
                        category: {
                            name: "rent",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 0,
                        date: new Date(2021, 10, 1),
                        initiator: "Rent for my crib",
                        purpose: "Thanks landlord",
                        value: -650,
                        category: {
                            name: "rent",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                ],
            },
        },
        {
            name: "insurance",
            fixedPayDay: {
                value: -14.99,
                isPaid: true,
                transactions: [
                    {
                        id: 0,
                        date: new Date(2021, 8, 3),
                        initiator: "Stay Healthy Corp.",
                        purpose: "Your health is our mission",
                        value: -14.99,
                        category: {
                            name: "insurance",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 0,
                        date: new Date(2021, 9, 1),
                        initiator: "Stay Healthy Corp.",
                        purpose: "Your health is our mission",
                        value: -14.99,
                        category: {
                            name: "insurance",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 0,
                        date: new Date(2021, 10, 2),
                        initiator: "Stay Healthy Corp.",
                        purpose: "Your health is our mission",
                        value: -14.99,
                        category: {
                            name: "insurance",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                ],
            },
        },
        {
            name: "mobile",
            fixedPayDay: {
                value: -39.99,
                isPaid: false,
                transactions: [
                    {
                        id: 0,
                        date: new Date(2021, 8, 22),
                        initiator: "Mobilio Ltd.",
                        purpose: "your mobile phone provider",
                        value: -39.99,
                        category: {
                            name: "mobile",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 0,
                        date: new Date(2021, 9, 22),
                        initiator: "Mobilio Ltd.",
                        purpose: "your mobile phone provider",
                        value: -39.99,
                        category: {
                            name: "mobile",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                ],
            },
        },
    ],
};
