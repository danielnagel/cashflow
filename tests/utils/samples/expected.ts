export const expectedFilteredTransaction1: ExtendedTransaction[] = [
    {
        id: 3,
        date: new Date(2021, 5, 1),
        initiator: "Rent for my crib",
        purpose: "Thanks landlord",
        value: 650,
        category: { name: "", type: "" },
    },
    {
        id: 4,
        date: new Date(2021, 5, 1),
        initiator: "Almost Healthy Inc.",
        purpose: "We bet that you're going to be sick",
        value: 12.99,
        category: { name: "", type: "" },
    },
];

export const expectedFilteredTransaction2: ExtendedTransaction[] = [
    {
        id: 13,
        category: { name: "", type: "" },
        date: new Date(2021, 10, 22),
        initiator: "my-online-shop.com",
        purpose: "my-online-shop.com; 22.11;  TES710928476309298",
        value: 9.99,
    },
    {
        id: 22,
        category: { name: "", type: "" },
        date: new Date(2021, 11, 1),
        initiator: "Rent for my crib",
        purpose: "Thanks landlord",
        value: 650,
    },
    {
        id: 23,
        category: { name: "", type: "" },
        date: new Date(2021, 11, 3),
        initiator: "Stay Healthy Corp.",
        purpose: "Your health is our mission",
        value: 14.99,
    },
    {
        id: 33,
        category: { name: "", type: "" },
        date: new Date(2021, 10, 23),
        initiator: "Online Payments Group",
        purpose: "Game Suprise Box Subscription",
        value: 19.99,
    },
];

export const expectedFilteredTransaction3: ExtendedTransaction[] = [
    {
        id: 13,
        category: { name: "", type: "" },
        date: new Date(2021, 10, 22),
        initiator: "my-online-shop.com",
        purpose: "my-online-shop.com; 22.11;  TES710928476309298",
        value: 9.99,
    },
    {
        id: 33,
        category: { name: "", type: "" },
        date: new Date(2021, 10, 23),
        initiator: "Online Payments Group",
        purpose: "Game Suprise Box Subscription",
        value: 19.99,
    },
];

export const expectedFilteredTransaction4: ExtendedTransaction[] = [
    {
        id: 3,
        date: new Date(2021, 5, 1),
        initiator: "Rent for my crib",
        purpose: "Thanks landlord",
        value: 650,
        category: {
            name: "rent",
            type: "fixed",
            period: undefined,
        },
    },
    {
        id: 4,
        date: new Date(2021, 5, 1),
        initiator: "Almost Healthy Inc.",
        purpose: "We bet that you're going to be sick",
        value: 12.99,
        category: {
            name: "insurance",
            type: "fixed",
            period: undefined,
        },
    },
    {
        id: 5,
        date: new Date(2021, 8, 1),
        initiator: "Rent for my crib",
        purpose: "Thanks landlord",
        value: 650,
        category: {
            name: "rent",
            type: "fixed",
            period: undefined,
        },
    },
    {
        id: 6,
        date: new Date(2021, 8, 3),
        initiator: "Stay Healthy Corp.",
        purpose: "Your health is our mission",
        value: 14.99,
        category: {
            name: "insurance",
            type: "fixed",
            period: undefined,
        },
    },
];

export const expectedFilteredTransaction5: ExtendedTransaction[] = [
    {
        id: 0,
        date: new Date(2021, 9, 19),
        initiator: "Beef Burger Palace",
        purpose: "We hope that you had a beefy good time!",
        value: 49.55,
        category: {
            name: "food",
            type: "variable",
            period: undefined,
        },
    },
    {
        id: 1,
        date: new Date(2021, 8, 1),
        initiator: "Melon the Man",
        purpose: "Juicy Melons",
        value: 39.38,
        category: {
            name: "food",
            type: "variable",
            period: undefined,
        },
    },
    {
        id: 2,
        date: new Date(2021, 10, 11),
        initiator: "Presentable Presents",
        purpose: "Good luck!",
        value: 199.78,
        category: {
            name: "presents",
            type: "variable",
            period: undefined,
        },
    },
    {
        id: 11,
        date: new Date(2021, 6, 7),
        initiator: "Grocerie Land",
        purpose: "VISA 23 GROCERIE LAND TES71234123423134",
        value: 109.56,
        category: {
            name: "groceries",
            type: "variable",
            period: undefined,
        },
    },
    {
        id: 7,
        date: new Date(2021, 7, 11),
        initiator: "Grocerie Land",
        purpose: "VISA 11 GROCERIE LAND TES71234123423134",
        value: 88.86,
        category: {
            name: "groceries",
            type: "variable",
            period: undefined,
        },
    },
];

export const expectedFilteredTransaction6: ExtendedTransaction[] = [
    {
        id: 0,
        date: new Date(2021, 9, 19),
        initiator: "Beef Burger Palace",
        purpose: "We hope that you had a beefy good time!",
        value: 49.55,
        category: {
            name: "food",
            type: "variable",
            period: undefined,
        },
    },
    {
        id: 1,
        date: new Date(2021, 8, 1),
        initiator: "Melon the Man",
        purpose: "Juicy Melons",
        value: 39.38,
        category: {
            name: "food",
            type: "variable",
            period: undefined,
        },
    },
];

export const expectedFilteredTransaction7: ExtendedTransaction[] = [
    {
        id: 3,
        date: new Date(2021, 5, 1),
        initiator: "Rent for my crib",
        purpose: "Thanks landlord",
        value: 650,
        category: { name: "", type: "" },
    },
    {
        id: 4,
        date: new Date(2021, 5, 1),
        initiator: "Almost Healthy Inc.",
        purpose: "We bet that you're going to be sick",
        value: 12.99,
        category: { name: "", type: "" },
    },
    {
        id: 31,
        category: { name: "", type: "" },
        date: new Date(2021, 5, 13),
        initiator: "Tasty Deli and Grocerie Store",
        purpose: "Thanks for buying the freshest food",
        value: 33.97,
    },
    {
        id: 34,
        category: { name: "", type: "" },
        date: new Date(2021, 5, 30),
        initiator: "Grocerie Land",
        purpose: "VISA 34 GROCERIE LAND TES412347123234334",
        value: 111.11,
    },
];

export const expectedSingleTransaction1: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "VISA 34 GROCERIE LAND TES7123123",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSingleTransaction2: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "VISA 34 GROCERIE LAND TES7123123",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSingleTransaction3: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "VISA 34 GROCERIE LAND TES7123123",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSingleTransaction4: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "VISA 34 GROCERIE LAND TES7123123",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSingleTransaction5: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSingleTransaction6: ExtendedTransaction = {
    id: 0,
    date: new Date(2021, 8, 7),
    initiator: "Grocerie Land",
    purpose: "VISA 34 GROCERIE LAND TES7123123",
    value: 111.96,
    category: {
        name: "groceries",
        type: "variable",
    },
};

export const expectedSmallTransactionList1: ExtendedTransaction[] = [
    {
        id: 0,
        date: new Date(2021, 8, 7),
        initiator: "Grocerie Land",
        purpose: "VISA 34 GROCERIE LAND TES7123123",
        value: 111.96,
        category: {
            name: "groceries",
            type: "variable",
        },
    },
];

export const expectedSmallTransactionList2: ExtendedTransaction[] = [
    {
        id: 0,
        date: new Date(2021, 8, 7),
        initiator: "Grocerie Land",
        purpose: "VISA 34 GROCERIE LAND TES7123123",
        value: 111.96,
        category: {
            name: "groceries",
            type: "variable",
        },
    },
];
