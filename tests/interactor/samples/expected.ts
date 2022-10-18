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

export const expectedReportFixedPayDayAndStoredEntries: ReportFixedPayDay = {
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
                        id: 19,
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
                        id: 22,
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
                        id: 0,
                        date: new Date(2021, 8, 2),
                        initiator: "Already in store insurance",
                        purpose: "stored and healthy",
                        value: -99.87,
                        category: {
                            name: "insurance",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 9,
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
                        id: 20,
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
                        id: 23,
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
                        id: 1,
                        date: new Date(2021, 8, 2),
                        initiator: "stored phone company",
                        purpose: "your stored phone provider",
                        value: -59.99,
                        category: {
                            name: "mobile",
                            type: "fixed",
                            period: "monthly",
                        },
                    },
                    {
                        id: 17,
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
                        id: 13,
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

export const expectedReportTrendAndStored: ReportTrend = {
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
                                    id: 5,
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
                                    id: 24,
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
                                    id: 11,
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
                                    id: 8,
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
                                    id: 19,
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
                                    id: 22,
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
                                    id: 27,
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
                            bookingDate: "03.08.2021",
                            period: "2021.08",
                            transactions: [
                                {
                                    id: 0,
                                    date: new Date(2021, 7, 3),
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
                            bookingDate: "03.09.2021",
                            period: "2021.09",
                            transactions: [
                                {
                                    id: 9,
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
                                    id: 20,
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
                                    id: 23,
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
                                    id: 28,
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
                                    id: 17,
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
                                    id: 13,
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
                                    id: 30,
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
                            sum: -118.44,
                            period: "2021.08",
                            transactions: [
                                {
                                    id: 1,
                                    date: new Date(2021, 7, 2),
                                    initiator: "cool-gadgets.com",
                                    purpose: "cool-gadgets.com.com",
                                    value: -99.99,
                                    category: {
                                        name: "shopping",
                                        type: "variable",
                                    },
                                },
                                {
                                    id: 31,
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
                                    id: 16,
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
                                    id: 14,
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
                                    id: 18,
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

export const transactions = {
    transactions: [
        {
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: -14.99,
            date: new Date(2021, 11, 3),
            id: 26,
            category: { name: "insurance", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 11, 1),
            id: 25,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Mobilio Ltd.",
            purpose: "your mobile phone provider",
            value: -39.99,
            date: new Date(2021, 10, 22),
            id: 28,
            category: { name: "mobile", type: "fixed", period: "monthly" },
        },
        {
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com",
            value: -9.99,
            date: new Date(2021, 10, 22),
            id: 16,
            category: { name: "shopping", type: "variable" },
        },
        {
            initiator: "Tasty Deli and Grocerie Store",
            purpose: "Thanks for buying the freshest food",
            value: -65.49,
            date: new Date(2021, 10, 10),
            id: 24,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Tasty Deli and Grocerie Store",
            purpose: "Thanks for buying the freshest food",
            value: -65.49,
            date: new Date(2021, 10, 10),
            id: 19,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "ONLINE SHOP 3",
            purpose: "Good choice mate 2344534",
            value: -7.99,
            date: new Date(2021, 10, 3),
            id: 2,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: -14.99,
            date: new Date(2021, 10, 2),
            id: 21,
            category: { name: "insurance", type: "fixed", period: "monthly" },
        },
        {
            initiator: "ONLINE SHOP 3",
            purpose: "Good choice mate 2345452",
            value: -57.21,
            date: new Date(2021, 10, 2),
            id: 1,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 10, 1),
            id: 20,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "FOOD SHOP 1",
            purpose: "Thanks for paying the food",
            value: -23,
            date: new Date(2021, 10, 1),
            id: 0,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Mobilio Ltd.",
            purpose: "your mobile phone provider",
            value: -39.99,
            date: new Date(2021, 9, 22),
            id: 11,
            category: { name: "mobile", type: "fixed", period: "monthly" },
        },
        {
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com",
            value: -23.65,
            date: new Date(2021, 9, 19),
            id: 12,
            category: { name: "shopping", type: "variable" },
        },
        {
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: -14.99,
            date: new Date(2021, 9, 1),
            id: 18,
            category: { name: "insurance", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 9, 1),
            id: 17,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Mobilio Ltd.",
            purpose: "your mobile phone provider",
            value: -39.99,
            date: new Date(2021, 8, 22),
            id: 15,
            category: { name: "mobile", type: "fixed", period: "monthly" },
        },
        {
            initiator: "my-online-shop.com",
            purpose: "my-online-shop.com",
            value: -44.86,
            date: new Date(2021, 8, 21),
            id: 14,
            category: { name: "shopping", type: "variable" },
        },
        {
            initiator: "Grocerie Land",
            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
            value: -99.99,
            date: new Date(2021, 8, 15),
            id: 27,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Stay Healthy Corp.",
            purpose: "Your health is our mission",
            value: -14.99,
            date: new Date(2021, 8, 3),
            id: 7,
            category: { name: "insurance", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 8, 1),
            id: 6,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "cool-gadgets.com",
            purpose: "cool-gadgets.com.com",
            value: -18.45,
            date: new Date(2021, 7, 20),
            id: 29,
            category: { name: "shopping", type: "variable" },
        },
        {
            initiator: "Grocerie Land",
            purpose: "VISA 11 GROCERIE LAND TES71234123423134",
            value: -88.86,
            date: new Date(2021, 7, 11),
            id: 8,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: -12.99,
            date: new Date(2021, 7, 2),
            id: 10,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 7, 1),
            id: 9,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Grocerie Land",
            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
            value: -109.56,
            date: new Date(2021, 6, 7),
            id: 13,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Grocerie Land",
            purpose: "VISA 23 GROCERIE LAND TES71234123423134",
            value: -109.56,
            date: new Date(2021, 6, 7),
            id: 5,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: -12.99,
            date: new Date(2021, 6, 1),
            id: 23,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 6, 1),
            id: 22,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
        {
            initiator: "Almost Healthy Inc.",
            purpose: "We bet that you're going to be sick",
            value: -12.99,
            date: new Date(2021, 5, 1),
            id: 4,
            category: { name: "unmatched", type: "variable" },
        },
        {
            initiator: "Rent for my crib",
            purpose: "Thanks landlord",
            value: -650,
            date: new Date(2021, 5, 1),
            id: 3,
            category: { name: "rent", type: "fixed", period: "monthly" },
        },
    ],
    type: "transactions",
};
