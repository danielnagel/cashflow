export const fixedPayDayReport: ReportFixedPayDay = {
    type: "fixedpayday",
    report: {
        date: "15.11.2021",
        sum: -704.98,
        unpaidSum: -39.99,
        namedFixedPayDays: [
            {
                name: "rent",
                fixedPayDay: {
                    value: -650,
                    isPaid: true,
                    lastBookingDays: [1, 1],
                    averageBookingDay: 1,
                    transactions: [
                        {
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 11,
                            year: 2021,
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
                    lastBookingDays: [3, 1, 2],
                    averageBookingDay: 2,
                    transactions: [
                        {
                            day: 3,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                    lastBookingDays: [22, 22],
                    averageBookingDay: 22,
                    transactions: [
                        {
                            day: 22,
                            month: 9,
                            year: 2021,
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
                            day: 22,
                            month: 10,
                            year: 2021,
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
    },
};
