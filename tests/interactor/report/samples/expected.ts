export const fixedTrendPeriodForOneCategory: FixedCategoryTrendPeriod = {
    value: 39.99,
    bookingDate: "22.09.2021",
    period: "2021.09",
    transactions: [
        {
            day: 22,
            month: 9,
            year: 2021,
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
};

export const variableTrendPeriodForOneCategory: VariableCategoryTrendPeriod = {
    sum: 320.59,
    period: "2021.09",
    transactions: [
        {
            day: 7,
            month: 9,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 111.96,
            category: {
                name: "groceries",
                type: "variable",
            },
        },
        {
            day: 16,
            month: 9,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 88.77,
            category: {
                name: "groceries",
                type: "variable",
            },
        },
        {
            day: 24,
            month: 9,
            year: 2021,
            initiator: "Grocerie Land",
            purpose: "VISA 34 GROCERIE LAND TES7123123",
            value: 119.86,
            category: {
                name: "groceries",
                type: "variable",
            },
        },
    ],
};

export const incomeTrendPeriodForOneCategory: FixedCategoryTrendPeriod = {
    value: 1667.99,
    bookingDate: "28.09.2021",
    period: "2021.09",
    transactions: [
        {
            day: 28,
            month: 9,
            year: 2021,
            initiator: "Owl Logistic Corp.",
            purpose: "Have fun",
            value: 1667.99,
            category: {
                name: "salary",
                type: "income",
            },
        },
    ],
};

export const specialTrendPeriodForOneCategory: VariableCategoryTrendPeriod = {
    sum: 2899.98,
    period: "2021.10",
    transactions: [
        {
            day: 25,
            month: 10,
            year: 2021,
            initiator: "Kitchen Shop 24/7",
            purpose: "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
            value: 2899.98,
            category: {
                name: "home",
                type: "special",
            },
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
                    day: 22,
                    month: 9,
                    year: 2021,
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
                    day: 22,
                    month: 10,
                    year: 2021,
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
                    day: 22,
                    month: 11,
                    year: 2021,
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
                    day: 7,
                    month: 7,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                    value: 109.56,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
                {
                    day: 7,
                    month: 7,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 23 GROCERIE LAND TES71234123423134",
                    value: 11.99,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
            ],
        },
        {
            sum: 88.86,
            period: "2021.08",
            transactions: [
                {
                    day: 11,
                    month: 8,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 11 GROCERIE LAND TES71234123423134",
                    value: 88.86,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
            ],
        },
        {
            sum: 320.59,
            period: "2021.09",
            transactions: [
                {
                    day: 7,
                    month: 9,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 111.96,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
                {
                    day: 16,
                    month: 9,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 88.77,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
                {
                    day: 24,
                    month: 9,
                    year: 2021,
                    initiator: "Grocerie Land",
                    purpose: "VISA 34 GROCERIE LAND TES7123123",
                    value: 119.86,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
            ],
        },
        {
            sum: 85.93,
            period: "2021.11",
            transactions: [
                {
                    day: 10,
                    month: 11,
                    year: 2021,
                    initiator: "Tasty Deli and Grocerie Store",
                    purpose: "Thanks for buying the freshest food",
                    value: 65.49,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
                },
                {
                    day: 10,
                    month: 11,
                    year: 2021,
                    initiator: "Tasty Deli and Grocerie Store",
                    purpose: "Thanks for buying the freshest food",
                    value: 20.44,
                    category: {
                        name: "groceries",
                        type: "variable",
                    },
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
                    day: 28,
                    month: 1,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "26.02.2021",
            period: "2021.02",
            transactions: [
                {
                    day: 26,
                    month: 2,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "29.03.2021",
            period: "2021.03",
            transactions: [
                {
                    day: 29,
                    month: 3,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.04.2021",
            period: "2021.04",
            transactions: [
                {
                    day: 28,
                    month: 4,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "27.05.2021",
            period: "2021.05",
            transactions: [
                {
                    day: 27,
                    month: 5,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.06.2021",
            period: "2021.06",
            transactions: [
                {
                    day: 28,
                    month: 6,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "29.07.2021",
            period: "2021.07",
            transactions: [
                {
                    day: 29,
                    month: 7,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "27.08.2021",
            period: "2021.08",
            transactions: [
                {
                    day: 27,
                    month: 8,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.09.2021",
            period: "2021.09",
            transactions: [
                {
                    day: 28,
                    month: 9,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1667.99,
            bookingDate: "28.10.2021",
            period: "2021.10",
            transactions: [
                {
                    day: 28,
                    month: 10,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1667.99,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1822.37,
            bookingDate: "29.11.2021",
            period: "2021.11",
            transactions: [
                {
                    day: 29,
                    month: 11,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1822.37,
                    category: {
                        name: "salary",
                        type: "income",
                    },
                },
            ],
        },
        {
            value: 1822.37,
            bookingDate: "28.12.2021",
            period: "2021.12",
            transactions: [
                {
                    day: 28,
                    month: 12,
                    year: 2021,
                    initiator: "Owl Logistic Corp.",
                    purpose: "Have fun",
                    value: 1822.37,
                    category: {
                        name: "salary",
                        type: "income",
                    },
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
                    day: 25,
                    month: 10,
                    year: 2021,
                    initiator: "Kitchen Shop 24/7",
                    purpose:
                        "VISA Kitchen Shop Store 24/7; 25.10;  TES71234326654734",
                    value: 2899.98,
                    category: {
                        name: "home",
                        type: "special",
                    },
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
                            day: 13,
                            month: 1,
                            year: 2021,
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
                            day: 1,
                            month: 1,
                            year: 2021,
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
                            day: 1,
                            month: 4,
                            year: 2021,
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
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 6,
                            year: 2021,
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
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 1,
                            month: 8,
                            year: 2021,
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
                            day: 1,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 11,
                            year: 2021,
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
                            day: 1,
                            month: 12,
                            year: 2021,
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
                            day: 1,
                            month: 6,
                            year: 2021,
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
                            day: 1,
                            month: 7,
                            year: 2021,
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
                            day: 2,
                            month: 8,
                            year: 2021,
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
                            day: 3,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                            day: 3,
                            month: 12,
                            year: 2021,
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
                            day: 15,
                            month: 7,
                            year: 2021,
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
                            day: 15,
                            month: 8,
                            year: 2021,
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
                            day: 15,
                            month: 9,
                            year: 2021,
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
                            day: 15,
                            month: 10,
                            year: 2021,
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
                            day: 15,
                            month: 11,
                            year: 2021,
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
                            day: 23,
                            month: 8,
                            year: 2021,
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
                            day: 23,
                            month: 9,
                            year: 2021,
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
                            day: 23,
                            month: 10,
                            year: 2021,
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
                            day: 23,
                            month: 11,
                            year: 2021,
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
                            day: 1,
                            month: 9,
                            year: 2021,
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: {
                                name: "food",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 49.55,
                    period: "2021.10",
                    transactions: [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: {
                                name: "food",
                                type: "variable",
                            },
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
                            day: 11,
                            month: 11,
                            year: 2021,
                            initiator: "Presentable Presents",
                            purpose: "Good luck!",
                            value: 199.78,
                            category: {
                                name: "presents",
                                type: "variable",
                            },
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
                            day: 21,
                            month: 9,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 21.09;  TES710928476309298",
                            value: 44.86,
                            category: {
                                name: "shopping",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 23.65,
                    period: "2021.10",
                    transactions: [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 19.10; TES710928476309298",
                            value: 23.65,
                            category: {
                                name: "shopping",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 9.99,
                    period: "2021.11",
                    transactions: [
                        {
                            day: 22,
                            month: 11,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 22.11;  TES710928476309298",
                            value: 9.99,
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
                    bookingDate: "01.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            day: 1,
                            month: 10,
                            year: 2021,
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
                    bookingDate: "01.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            day: 1,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 1,
                            month: 11,
                            year: 2021,
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
                            day: 1,
                            month: 12,
                            year: 2021,
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
                    bookingDate: "03.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            day: 3,
                            month: 9,
                            year: 2021,
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
                            day: 1,
                            month: 10,
                            year: 2021,
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
                            day: 2,
                            month: 11,
                            year: 2021,
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
                            day: 3,
                            month: 12,
                            year: 2021,
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
                    bookingDate: "15.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            day: 15,
                            month: 9,
                            year: 2021,
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
                            day: 15,
                            month: 10,
                            year: 2021,
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
                            day: 15,
                            month: 11,
                            year: 2021,
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
                    bookingDate: "23.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            day: 23,
                            month: 9,
                            year: 2021,
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
                            day: 23,
                            month: 10,
                            year: 2021,
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
                            day: 23,
                            month: 11,
                            year: 2021,
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
                            day: 1,
                            month: 9,
                            year: 2021,
                            initiator: "Melon the Man",
                            purpose: "Juicy Melons",
                            value: 39.38,
                            category: {
                                name: "food",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 49.55,
                    period: "2021.10",
                    transactions: [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "Beef Burger Palace",
                            purpose: "We hope that you had a beefy good time!",
                            value: 49.55,
                            category: {
                                name: "food",
                                type: "variable",
                            },
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
                            day: 7,
                            month: 9,
                            year: 2021,
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 111.96,
                            category: {
                                name: "groceries",
                                type: "variable",
                            },
                        },
                        {
                            day: 16,
                            month: 9,
                            year: 2021,
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 88.77,
                            category: {
                                name: "groceries",
                                type: "variable",
                            },
                        },
                        {
                            day: 24,
                            month: 9,
                            year: 2021,
                            initiator: "Grocerie Land",
                            purpose: "VISA 34 GROCERIE LAND TES7123123",
                            value: 119.86,
                            category: {
                                name: "groceries",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 85.93,
                    period: "2021.11",
                    transactions: [
                        {
                            day: 10,
                            month: 11,
                            year: 2021,
                            initiator: "Tasty Deli and Grocerie Store",
                            purpose: "Thanks for buying the freshest food",
                            value: 65.49,
                            category: {
                                name: "groceries",
                                type: "variable",
                            },
                        },
                        {
                            day: 10,
                            month: 11,
                            year: 2021,
                            initiator: "Tasty Deli and Grocerie Store",
                            purpose: "Thanks for buying the freshest food",
                            value: 20.44,
                            category: {
                                name: "groceries",
                                type: "variable",
                            },
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
                            day: 11,
                            month: 11,
                            year: 2021,
                            initiator: "Presentable Presents",
                            purpose: "Good luck!",
                            value: 199.78,
                            category: {
                                name: "presents",
                                type: "variable",
                            },
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
                            day: 21,
                            month: 9,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 21.09;  TES710928476309298",
                            value: 44.86,
                            category: {
                                name: "shopping",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 23.65,
                    period: "2021.10",
                    transactions: [
                        {
                            day: 19,
                            month: 10,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 19.10; TES710928476309298",
                            value: 23.65,
                            category: {
                                name: "shopping",
                                type: "variable",
                            },
                        },
                    ],
                },
                {
                    sum: 9.99,
                    period: "2021.11",
                    transactions: [
                        {
                            day: 22,
                            month: 11,
                            year: 2021,
                            initiator: "my-online-shop.com",
                            purpose:
                                "my-online-shop.com; 22.11;  TES710928476309298",
                            value: 9.99,
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
};

export const trendForIncomeSingleCategoryAfter: Trend = {
    type: "income",
    categories: [
        {
            name: "salary",
            periods: [
                {
                    value: 1667.99,
                    bookingDate: "28.09.2021",
                    period: "2021.09",
                    transactions: [
                        {
                            day: 28,
                            month: 9,
                            year: 2021,
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1667.99,
                            category: {
                                name: "salary",
                                type: "income",
                            },
                        },
                    ],
                },
                {
                    value: 1667.99,
                    bookingDate: "28.10.2021",
                    period: "2021.10",
                    transactions: [
                        {
                            day: 28,
                            month: 10,
                            year: 2021,
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1667.99,
                            category: {
                                name: "salary",
                                type: "income",
                            },
                        },
                    ],
                },
                {
                    value: 1822.37,
                    bookingDate: "29.11.2021",
                    period: "2021.11",
                    transactions: [
                        {
                            day: 29,
                            month: 11,
                            year: 2021,
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1822.37,
                            category: {
                                name: "salary",
                                type: "income",
                            },
                        },
                    ],
                },
                {
                    value: 1822.37,
                    bookingDate: "28.12.2021",
                    period: "2021.12",
                    transactions: [
                        {
                            day: 28,
                            month: 12,
                            year: 2021,
                            initiator: "Owl Logistic Corp.",
                            purpose: "Have fun",
                            value: 1822.37,
                            category: {
                                name: "salary",
                                type: "income",
                            },
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
