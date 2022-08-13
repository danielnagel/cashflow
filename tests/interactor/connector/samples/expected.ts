export const extendedTransactionStore: ExtendedTransactionStore = {
    extendedTransactions: [
        {
            id: 0,
            date: new Date(2020, 0, 3),
            initiator: "Big Insurance Corp.",
            purpose: "For you car",
            value: 1200,
            category: {
                name: "car insurance",
                type: "fixed",
                period: "yearly",
            },
        },
        {
            id: 1,
            date: new Date(2021, 9, 19),
            initiator: "Beef Burger Palace",
            purpose: "We hope that you had a beefy good time!",
            value: 49.55,
            category: { name: "food", type: "variable" },
        },
        {
            id: 2,
            date: new Date(2021, 0, 6),
            initiator: "Taxes",
            purpose: "The state wants some money from you",
            value: 55.56,
            category: { name: "tax", type: "fixed", period: "quarter" },
        },
        {
            id: 3,
            date: new Date(2021, 8, 1),
            initiator: "Melon the Man",
            purpose: "Juicy Melons",
            value: 39.38,
            category: { name: "food", type: "variable" },
        },
    ],
    latestEntry: 3,
    size: 4,
};

export const emptyExtendedTransactionStore: ExtendedTransactionStore = {
    extendedTransactions: [],
    latestEntry: -1,
    size: 0,
};
