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

export const trendReport: ReportTrend = {
    type: "trend",
    report: {
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
                                        day: 1,
                                        month: 6,
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
                            {
                                value: -650,
                                bookingDate: "01.07.2021",
                                period: "2021.07",
                                transactions: [
                                    {
                                        day: 1,
                                        month: 7,
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
                            {
                                value: -650,
                                bookingDate: "01.08.2021",
                                period: "2021.08",
                                transactions: [
                                    {
                                        day: 1,
                                        month: 8,
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
                            {
                                value: -650,
                                bookingDate: "01.09.2021",
                                period: "2021.09",
                                transactions: [
                                    {
                                        day: 1,
                                        month: 9,
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
                            {
                                value: -650,
                                bookingDate: "01.10.2021",
                                period: "2021.10",
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
                                ],
                            },
                            {
                                value: -650,
                                bookingDate: "01.11.2021",
                                period: "2021.11",
                                transactions: [
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
                            {
                                value: -650,
                                bookingDate: "01.12.2021",
                                period: "2021.12",
                                transactions: [
                                    {
                                        day: 1,
                                        month: 12,
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
                                ],
                            },
                            {
                                value: -14.99,
                                bookingDate: "01.10.2021",
                                period: "2021.10",
                                transactions: [
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
                                ],
                            },
                            {
                                value: -14.99,
                                bookingDate: "02.11.2021",
                                period: "2021.11",
                                transactions: [
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
                            {
                                value: -14.99,
                                bookingDate: "03.12.2021",
                                period: "2021.12",
                                transactions: [
                                    {
                                        day: 3,
                                        month: 12,
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
                                ],
                            },
                            {
                                value: -39.99,
                                bookingDate: "22.10.2021",
                                period: "2021.10",
                                transactions: [
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
                            {
                                value: -39.99,
                                bookingDate: "22.11.2021",
                                period: "2021.11",
                                transactions: [
                                    {
                                        day: 22,
                                        month: 11,
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
                                        day: 20,
                                        month: 8,
                                        year: 2021,
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
                                        day: 21,
                                        month: 9,
                                        year: 2021,
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
                                        day: 19,
                                        month: 10,
                                        year: 2021,
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
                                        day: 22,
                                        month: 11,
                                        year: 2021,
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
    },
};
