export const expectedReportFixedPayDay: ReportFixedPayDay = {
    type: "fixedpayday",
    sum: 704.98,
    unpaidSum: 39.99,
    namedFixedPayDays: [
        {
            name: "rent",
            fixedPayDay: {
                value: 650,
                isPaid: true,
                transactions: [
                    {
                        id: 17,
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
                        id: 20,
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
                value: 14.99,
                isPaid: true,
                transactions: [
                    {
                        id: 7,
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
                        id: 18,
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
                        id: 21,
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
                value: 39.99,
                isPaid: false,
                transactions: [
                    {
                        id: 15,
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
                        id: 11,
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

export const expectedReportTrend: ReportTrend = {
    type: "trend",
    trends: [
        {
            type: "fixed",
            categories: [
                {
                    name: "rent",
                    periods: [
                        {
                            value: -650,
                            bookingDate: "01.06.2021",
                            period: "2021.06",
                            transactions: [
                                {
                                    id: 3,
                                    date: new Date(2021, 5, 1),
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
                        {
                            value: -650,
                            bookingDate: "01.07.2021",
                            period: "2021.07",
                            transactions: [
                                {
                                    id: 22,
                                    date: new Date(2021, 6, 1),
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
                        {
                            value: -650,
                            bookingDate: "01.08.2021",
                            period: "2021.08",
                            transactions: [
                                {
                                    id: 9,
                                    date: new Date(2021, 7, 1),
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
                        {
                            value: -650,
                            bookingDate: "01.09.2021",
                            period: "2021.09",
                            transactions: [
                                {
                                    id: 6,
                                    date: new Date(2021, 8, 1),
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
                        {
                            value: -650,
                            bookingDate: "01.10.2021",
                            period: "2021.10",
                            transactions: [
                                {
                                    id: 17,
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
                            ],
                        },
                        {
                            value: -650,
                            bookingDate: "01.11.2021",
                            period: "2021.11",
                            transactions: [
                                {
                                    id: 20,
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
                        {
                            value: -650,
                            bookingDate: "01.12.2021",
                            period: "2021.12",
                            transactions: [
                                {
                                    id: 25,
                                    date: new Date(2021, 11, 1),
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
                    ],
                },
                {
                    name: "insurance",
                    periods: [
                        {
                            value: -14.99,
                            bookingDate: "03.09.2021",
                            period: "2021.09",
                            transactions: [
                                {
                                    id: 7,
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
                            ],
                        },
                        {
                            value: -14.99,
                            bookingDate: "01.10.2021",
                            period: "2021.10",
                            transactions: [
                                {
                                    id: 18,
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
                            ],
                        },
                        {
                            value: -14.99,
                            bookingDate: "02.11.2021",
                            period: "2021.11",
                            transactions: [
                                {
                                    id: 21,
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
                        {
                            value: -14.99,
                            bookingDate: "03.12.2021",
                            period: "2021.12",
                            transactions: [
                                {
                                    id: 26,
                                    date: new Date(2021, 11, 3),
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
                    ],
                },
                {
                    name: "mobile",
                    periods: [
                        {
                            value: -39.99,
                            bookingDate: "22.09.2021",
                            period: "2021.09",
                            transactions: [
                                {
                                    id: 15,
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
                            ],
                        },
                        {
                            value: -39.99,
                            bookingDate: "22.10.2021",
                            period: "2021.10",
                            transactions: [
                                {
                                    id: 11,
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
                        {
                            value: -39.99,
                            bookingDate: "22.11.2021",
                            period: "2021.11",
                            transactions: [
                                {
                                    id: 28,
                                    date: new Date(2021, 10, 22),
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
                    ],
                },
            ],
        },
        {
            type: "variable",
            categories: [
                {
                    name: "shopping",
                    periods: [
                        {
                            sum: -18.45,
                            period: "2021.08",
                            transactions: [
                                {
                                    id: 29,
                                    date: new Date(2021, 7, 20),
                                    initiator: "cool-gadgets.com",
                                    purpose: "cool-gadgets.com.com",
                                    value: -18.45,
                                    category: {
                                        name: "shopping",
                                        type: "variable",
                                    },
                                },
                            ],
                        },
                        {
                            sum: -44.86,
                            period: "2021.09",
                            transactions: [
                                {
                                    id: 14,
                                    date: new Date(2021, 8, 21),
                                    initiator: "my-online-shop.com",
                                    purpose: "my-online-shop.com",
                                    value: -44.86,
                                    category: {
                                        name: "shopping",
                                        type: "variable",
                                    },
                                },
                            ],
                        },
                        {
                            sum: -23.65,
                            period: "2021.10",
                            transactions: [
                                {
                                    id: 12,
                                    date: new Date(2021, 9, 19),
                                    initiator: "my-online-shop.com",
                                    purpose: "my-online-shop.com",
                                    value: -23.65,
                                    category: {
                                        name: "shopping",
                                        type: "variable",
                                    },
                                },
                            ],
                        },
                        {
                            sum: -9.99,
                            period: "2021.11",
                            transactions: [
                                {
                                    id: 16,
                                    date: new Date(2021, 10, 22),
                                    initiator: "my-online-shop.com",
                                    purpose: "my-online-shop.com",
                                    value: -9.99,
                                    category: {
                                        name: "shopping",
                                        type: "variable",
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
