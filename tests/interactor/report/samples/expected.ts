export const fixedTrendPeriodForOneCategory: FixedCategoryTrendPeriod = {
    value: 39.99,
    bookingDate: "22.09.2021",
    period: "2021.09",
    transactions: [
        {
            date: new Date(2021, 8, 22),
            initiator: "Mobilio Ltd.",
            purpose: "your mobile phone provider",
            value: 39.99,
            category: { name: "mobile", type: "fixed", period: "monthly" },
        },
    ],
};

export const variableTrendPeriodForOneCategory: VariableCategoryTrendPeriod = {
    sum: 320.59,
    period: "2021.09",
    transactions: [
        {
            date: new Date(2021, 8, 7),
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 111.96,
            category: { name: "groceries", type: "variable" },
        },
        {
            date: new Date(2021, 8, 16),
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 88.77,
            category: { name: "groceries", type: "variable" },
        },
        {
            date: new Date(2021, 8, 24),
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 119.86,
            category: { name: "groceries", type: "variable" },
        },
    ],
};

export const incomeTrendPeriodForOneCategory: FixedCategoryTrendPeriod = {
    value: 1667.99,
    bookingDate: "28.09.2021",
    period: "2021.09",
    transactions: [
        {
            date: new Date(2021, 8, 28),
            initiator: "Owl Logistic Corp.",
            purpose: "Have fun",
            value: 1667.99,
            category: { name: "salary", type: "income" },
        },
    ],
};

export const specialTrendPeriodForOneCategory: VariableCategoryTrendPeriod = {
    sum: 2899.98,
    period: "2021.10",
    transactions: [
        {
            date: new Date(2021, 9, 25),
            initiator: "Kitchen Shop 24/7",
            purpose: "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
            value: 2899.98,
            category: { name: "home", type: "special" },
        },
    ],
};

export const fixedSingleCategoryTrend: CategoryTrend = {
    name: "mobile",
    periods: [
        {
            value: 39.99,
            bookingDate: "22.09.2021",
            period: "2021.09",
            transactions: [
                {
                    date: new Date(2021, 8, 22),
                    initiator: "Mobilio Ltd.",
                    purpose: "your mobile phone provider",
                    value: 39.99,
                    category: {
                        name: "mobile",
                        type: "fixed",
                        period: "monthly",
                    },
                },
            ],
        },
        {
            value: 39.99,
            bookingDate: "22.10.2021",
            period: "2021.10",
            transactions: [
                {
                    date: new Date(2021, 9, 22),
                    initiator: "Mobilio Ltd.",
                    purpose: "your mobile phone provider",
                    value: 39.99,
                    category: {
                        name: "mobile",
                        type: "fixed",
                        period: "monthly",
                    },
                },
            ],
        },
        {
            value: 49.99,
            bookingDate: "22.11.2021",
            period: "2021.11",
            transactions: [
                {
                    date: new Date(2021, 10, 22),
                    initiator: "Mobilio Ltd.",
                    purpose: "your mobile phone provider",
                    value: 49.99,
                    category: {
                        name: "mobile",
                        type: "fixed",
                        period: "monthly",
                    },
                },
            ],
        },
    ],
};

export const variableSingleCategoryTrend: CategoryTrend = {
    name: "groceries",
    periods: [
        {
            sum: 121.55,
            period: "2021.07",
            transactions: [
                {
                    date: new Date(2021, 6, 7),
                    initiator: "Grocerie Land",
                    purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                    value: 109.56,
                    category: { name: "groceries", type: "variable" },
                },
                {
                    date: new Date(2021, 6, 7),
                    initiator: "Grocerie Land",
                    purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                    value: 11.99,
                    category: { name: "groceries", type: "variable" },
                },
            ],
        },
        {
            sum: 88.86,
            period: "2021.08",
            transactions: [
                {
                    date: new Date(2021, 7, 11),
                    initiator: "Grocerie Land",
                    purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                    value: 88.86,
                    category: { name: "groceries", type: "variable" },
                },
            ],
        },
        {
            sum: 320.59,
            period: "2021.09",
            transactions: [
                {
                    date: new Date(2021, 8, 7),
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 111.96,
                    category: { name: "groceries", type: "variable" },
                },
                {
                    date: new Date(2021, 8, 16),
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 88.77,
                    category: { name: "groceries", type: "variable" },
                },
                {
                    date: new Date(2021, 8, 24),
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 119.86,
                    category: { name: "groceries", type: "variable" },
                },
            ],
        },
        {
            sum: 85.93,
            period: "2021.11",
            transactions: [
                {
                    date: new Date(2021, 10, 10),
                    initiator: "Tasty Deli and Grocerie Store",
                    purpose: "Thanks for buying the freshest food",
                    value: 65.49,
                    category: { name: "groceries", type: "variable" },
                },
                {
                    date: new Date(2021, 10, 10),
                    initiator: "Tasty Deli and Grocerie Store",
                    purpose: "Thanks for buying the freshest food",
                    value: 20.44,
                    category: { name: "groceries", type: "variable" },
                },
            ],
        },
    ],
};

export const incomeSingleCategoryTrend: CategoryTrend = {
    name: "salary",
    periods: [
        {
            value: 1667.99,
            bookingDate: "28.01.2021",
            period: "2021.01",
            transactions: [
                {
                    date: new Date(2021, 0, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "26.02.2021",
            period: "2021.02",
            transactions: [
                {
                    date: new Date(2021, 1, 26),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "29.03.2021",
            period: "2021.03",
            transactions: [
                {
                    date: new Date(2021, 2, 29),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.04.2021",
            period: "2021.04",
            transactions: [
                {
                    date: new Date(2021, 3, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "27.05.2021",
            period: "2021.05",
            transactions: [
                {
                    date: new Date(2021, 4, 27),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.06.2021",
            period: "2021.06",
            transactions: [
                {
                    date: new Date(2021, 5, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "29.07.2021",
            period: "2021.07",
            transactions: [
                {
                    date: new Date(2021, 6, 29),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "27.08.2021",
            period: "2021.08",
            transactions: [
                {
                    date: new Date(2021, 7, 27),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.09.2021",
            period: "2021.09",
            transactions: [
                {
                    date: new Date(2021, 8, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.10.2021",
            period: "2021.10",
            transactions: [
                {
                    date: new Date(2021, 9, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1822.37,
            bookingDate: "29.11.2021",
            period: "2021.11",
            transactions: [
                {
                    date: new Date(2021, 10, 29),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1822.37,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
        {
            value: 1822.37,
            bookingDate: "28.12.2021",
            period: "2021.12",
            transactions: [
                {
                    date: new Date(2021, 11, 28),
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1822.37,
                    category: { name: "salary", type: "income" },
                },
            ],
        },
    ],
};

export const specialSingleCategoryTrend: CategoryTrend = {
    name: "home",
    periods: [
        {
            sum: 2899.98,
            period: "2021.10",
            transactions: [
                {
                    date: new Date(2021, 9, 25),
                    initiator: "Kitchen Shop 24/7",
                    purpose:
                        "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
                    value: 2899.98,
                    category: { name: "home", type: "special" },
                },
            ],
        },
    ],
};

export const trendForFixedSingleCategory: Trend = {
    type: "fixed",
    categories: [fixedSingleCategoryTrend],
};

export const trendForVariableSingleCategory: Trend = {
    type: "variable",
    categories: [variableSingleCategoryTrend],
};

export const trendForIncomeSingleCategory: Trend = {
    type: "income",
    categories: [incomeSingleCategoryTrend],
};

export const trendForSpecialSingleCategory: Trend = {
    type: "special",
    categories: [specialSingleCategoryTrend],
};

export const trendForFixed: Trend = {
    type: "fixed",
    categories: [
        {
            name: "car insurance",
            periods: [
                {
                    value: 999.99,
                    bookingDate: "13.01.2021",
                    period: "2021.01",
                    transactions: [
                        {
                            date: new Date(2021, 0, 13),
                            initiator: "Car Insurance Corp.",
                            purpose: "Safety first!",
                            value: 999.99,
                            category: {
                                name: "car insurance",
                                type: "fixed",
                                period: "yearly",
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "luxury",
            periods: [
                {
                    value: 56.4,
                    bookingDate: "01.01.2021",
                    period: "2021.01",
                    transactions: [
                        {
                            date: new Date(2021, 0, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                },
                {
                    value: 56.4,
                    bookingDate: "01.04.2021",
                    period: "2021.04",
                    transactions: [
                        {
                            date: new Date(2021, 3, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                },
                {
                    value: 56.4,
                    bookingDate: "01.07.2021",
                    period: "2021.07",
                    transactions: [
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                },
                {
                    value: 56.4,
                    bookingDate: "01.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "rent",
            periods: [
                {
                    value: 650,
                    bookingDate: "01.06.2021",
                    period: "2021.06",
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.07.2021",
                    period: "2021.07",
                    transactions: [
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.08.2021",
                    period: "2021.08",
                    transactions: [
                        {
                            date: new Date(2021, 7, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.11.2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "01.12.2021",
                    period: "2021.12",
                    transactions: [
                        {
                            date: new Date(2021, 11, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
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
                    value: 12.99,
                    bookingDate: "01.06.2021",
                    period: "2021.06",
                    transactions: [
                        {
                            date: new Date(2021, 5, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 12.99,
                    bookingDate: "01.07.2021",
                    period: "2021.07",
                    transactions: [
                        {
                            date: new Date(2021, 6, 1),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 12.99,
                    bookingDate: "02.08.2021",
                    period: "2021.08",
                    transactions: [
                        {
                            date: new Date(2021, 7, 2),
                            initiator: "Almost Healthy Inc.",
                            purpose: "We bet that you're going to be sick",
                            value: 12.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "03.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "01.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "02.11.2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 2),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "03.12.2021",
                    period: "2021.12",
                    transactions: [
                        {
                            date: new Date(2021, 11, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
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
        fixedSingleCategoryTrend,
        {
            name: "music subscription",
            periods: [
                {
                    value: 9.99,
                    bookingDate: "15.07.2021",
                    period: "2021.07",
                    transactions: [
                        {
                            date: new Date(2021, 6, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "15.08.2021",
                    period: "2021.08",
                    transactions: [
                        {
                            date: new Date(2021, 7, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "15.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "15.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "15.11.2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "gaming subscription",
            periods: [
                {
                    value: 19.99,
                    bookingDate: "23.08.2021",
                    period: "2021.08",
                    transactions: [
                        {
                            date: new Date(2021, 7, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
                {
                    value: 19.99,
                    bookingDate: "23.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
                {
                    value: 19.99,
                    bookingDate: "23.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
                {
                    value: 19.99,
                    bookingDate: "23.11.2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};

export const trendForVariable: Trend = {
    type: "variable",
    categories: [
        {
            name: "food",
            periods: [
                {
                    sum: 39.38,
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: { name: "food", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 49.55,
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 19),
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: { name: "food", type: "variable" },
                        },
                    ],
                },
            ],
        },
        variableSingleCategoryTrend,
        {
            name: "presents",
            periods: [
                {
                    sum: 199.78,
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 11),
                            initiator: "Presentable Presents",
                            purpose: "Good luck!",
                            value: 199.78,
                            category: { name: "presents", type: "variable" },
                        },
                    ],
                },
            ],
        },
        {
            name: "shopping",
            periods: [
                {
                    sum: 44.86,
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 21),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 21.09;  TES710928476309298",
                            value: 44.86,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 23.65,
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 19),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 19.10; TES710928476309298",
                            value: 23.65,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 9.99,
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 22),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 22.11;  TES710928476309298",
                            value: 9.99,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
            ],
        },
    ],
};

export const fixedTrendReport: TrendReport = {
    trendType: "fixed",
    trends: [trendForFixed],
};

export const variableTrendReport: TrendReport = {
    trendType: "variable",
    trends: [trendForVariable],
};

export const incomeTrendReport: TrendReport = {
    trendType: "income",
    trends: [trendForIncomeSingleCategory],
};

export const specialTrendReport: TrendReport = {
    trendType: "special",
    trends: [trendForSpecialSingleCategory],
};

export const trendReport: TrendReport = {
    trends: [
        trendForFixed,
        trendForVariable,
        trendForIncomeSingleCategory,
        trendForSpecialSingleCategory,
    ],
};

export const trendForFixedAfter: Trend = {
    type: "fixed",
    categories: [
        {
            name: "luxury",
            periods: [
                {
                    value: 56.4,
                    bookingDate: "10/01/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Luxurious Subscriptions",
                            purpose: "At least, it's not cheap.",
                            value: 56.4,
                            category: {
                                name: "luxury",
                                type: "fixed",
                                period: "quarter",
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "rent",
            periods: [
                {
                    value: 650,
                    bookingDate: "09/01/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "10/01/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "11/01/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
                            category: {
                                name: "rent",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 650,
                    bookingDate: "12/01/2021",
                    period: "2021.12",
                    transactions: [
                        {
                            date: new Date(2021, 11, 1),
                            initiator: "Rent for my crib",
                            purpose: "Thanks landlord",
                            value: 650,
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
                    value: 14.99,
                    bookingDate: "09/03/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "10/01/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 1),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "11/02/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 2),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
                            category: {
                                name: "insurance",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 14.99,
                    bookingDate: "12/03/2021",
                    period: "2021.12",
                    transactions: [
                        {
                            date: new Date(2021, 11, 3),
                            initiator: "Stay Healthy Corp.",
                            purpose: "Your health is our mission",
                            value: 14.99,
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
                    value: 39.99,
                    bookingDate: "09/22/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 22),
                            initiator: "Mobilio Ltd.",
                            purpose: "your mobile phone provider",
                            value: 39.99,
                            category: {
                                name: "mobile",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 39.99,
                    bookingDate: "10/22/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 22),
                            initiator: "Mobilio Ltd.",
                            purpose: "your mobile phone provider",
                            value: 39.99,
                            category: {
                                name: "mobile",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 49.99,
                    bookingDate: "11/22/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 22),
                            initiator: "Mobilio Ltd.",
                            purpose: "your mobile phone provider",
                            value: 49.99,
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
        {
            name: "music subscription",
            periods: [
                {
                    value: 9.99,
                    bookingDate: "09/15/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "10/15/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
                {
                    value: 9.99,
                    bookingDate: "11/15/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 15),
                            initiator: "Online Payments Group",
                            purpose: "Music Whale",
                            value: 9.99,
                            category: {
                                name: "music subscription",
                                type: "fixed",
                                period: "monthly",
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "gaming subscription",
            periods: [
                {
                    value: 19.99,
                    bookingDate: "09/23/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
                {
                    value: 19.99,
                    bookingDate: "10/23/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
                {
                    value: 19.99,
                    bookingDate: "11/23/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 23),
                            initiator: "Online Payments Group",
                            purpose: "Game Suprise Box Subscription",
                            value: 19.99,
                            category: {
                                name: "gaming subscription",
                                type: "fixed",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};

export const trendForVariableAfter: Trend = {
    type: "variable",
    categories: [
        {
            name: "food",
            periods: [
                {
                    sum: 39.38,
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 1),
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: { name: "food", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 49.55,
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 19),
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: { name: "food", type: "variable" },
                        },
                    ],
                },
            ],
        },
        {
            name: "groceries",
            periods: [
                {
                    sum: 320.59,
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 7),
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 111.96,
                            category: { name: "groceries", type: "variable" },
                        },
                        {
                            date: new Date(2021, 8, 16),
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 88.77,
                            category: { name: "groceries", type: "variable" },
                        },
                        {
                            date: new Date(2021, 8, 24),
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 119.86,
                            category: { name: "groceries", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 85.93,
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 10),
                            initiator: "Tasty Deli and Grocerie Store",
                            purpose: "Thanks for buying the freshest food",
                            value: 65.49,
                            category: { name: "groceries", type: "variable" },
                        },
                        {
                            date: new Date(2021, 10, 10),
                            initiator: "Tasty Deli and Grocerie Store",
                            purpose: "Thanks for buying the freshest food",
                            value: 20.44,
                            category: { name: "groceries", type: "variable" },
                        },
                    ],
                },
            ],
        },
        {
            name: "presents",
            periods: [
                {
                    sum: 199.78,
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 11),
                            initiator: "Presentable Presents",
                            purpose: "Good luck!",
                            value: 199.78,
                            category: { name: "presents", type: "variable" },
                        },
                    ],
                },
            ],
        },
        {
            name: "shopping",
            periods: [
                {
                    sum: 44.86,
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 21),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 21.09;  TES710928476309298",
                            value: 44.86,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 23.65,
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 19),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 19.10; TES710928476309298",
                            value: 23.65,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
                {
                    sum: 9.99,
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 22),
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 22.11;  TES710928476309298",
                            value: 9.99,
                            category: { name: "shopping", type: "variable" },
                        },
                    ],
                },
            ],
        },
    ],
};

export const trendForIncomeSingleCategoryAfter: Trend = {
    type: "income",
    categories: [
        {
            name: "salary",
            periods: [
                {
                    value: 1667.99,
                    bookingDate: "09/28/2021",
                    period: "2021.09",
                    transactions: [
                        {
                            date: new Date(2021, 8, 28),
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1667.99,
                            category: { name: "salary", type: "income" },
                        },
                    ],
                },
                {
                    value: 1667.99,
                    bookingDate: "10/28/2021",
                    period: "2021.10",
                    transactions: [
                        {
                            date: new Date(2021, 9, 28),
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1667.99,
                            category: { name: "salary", type: "income" },
                        },
                    ],
                },
                {
                    value: 1822.37,
                    bookingDate: "11/29/2021",
                    period: "2021.11",
                    transactions: [
                        {
                            date: new Date(2021, 10, 29),
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1822.37,
                            category: { name: "salary", type: "income" },
                        },
                    ],
                },
                {
                    value: 1822.37,
                    bookingDate: "12/28/2021",
                    period: "2021.12",
                    transactions: [
                        {
                            date: new Date(2021, 11, 28),
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1822.37,
                            category: { name: "salary", type: "income" },
                        },
                    ],
                },
            ],
        },
    ],
};

export const trendReportAfter: TrendReport = {
    trends: [
        trendForFixedAfter,
        trendForVariableAfter,
        trendForIncomeSingleCategoryAfter,
        trendForSpecialSingleCategory,
    ],
};
