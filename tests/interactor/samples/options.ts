import { TransactionType } from "../../../src/types/enums";

const dataJsonTestPath = __dirname + "/data.json";
const backUpPath = __dirname + "/backup/";

export const unknownConnectorType: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "unknown",
    },
    categories: [],
    storePath: dataJsonTestPath,
};

export const malformedConnectorType: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        backUpPath,
    },
    categories: [],
    storePath: dataJsonTestPath,
};

export const unknownReportType: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [],
    storePath: dataJsonTestPath,
};

export const strictIsTrue: Configuration = {
    allowedLogLevel: "none",
    strict: true,
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "failingtest",
            type: "variable",
            samples: [{ initiator: "ishallfail" }],
        },
    ],
    storePath: dataJsonTestPath,
};

export const strictIsTrueAndSomeTransactionMatch: Configuration = {
    allowedLogLevel: "none",
    strict: true,
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
        {
            name: "insurance",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Stay Healthy Corp." }],
        },
        {
            name: "mobile",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Mobilio Ltd." }],
        },
        {
            name: "shopping",
            type: TransactionType.Variable,
            samples: [
                { initiator: "my-online-shop.com" },
                { initiator: "cool-gadgets.com" },
            ],
        },
    ],
    storePath: dataJsonTestPath,
};

export const csvFileDoesNotExist: CsvConfiguration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1_.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
    ],
    storePath: dataJsonTestPath,
};

export const csvFileDoesNotEndWithCsv: CsvConfiguration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1.txt",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
    ],
    storePath: dataJsonTestPath,
};

export const fixedPayDayNoTransactions: CsvConfiguration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample2.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [],
    storePath: dataJsonTestPath,
};

export const trendNoTransactions: CsvConfiguration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample2.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [],
    storePath: dataJsonTestPath,
};

export const fixedPayDayFromCsv: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
        {
            name: "insurance",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Stay Healthy Corp." }],
        },
        {
            name: "mobile",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Mobilio Ltd." }],
        },
    ],
    startDate: "01.09.2021",
    endDate: "15.11.2021",
    storePath: dataJsonTestPath,
};

export const fixedPayDayFromCsvAndStored: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
        {
            name: "insurance",
            type: TransactionType.Fixed,
            samples: [
                { initiator: "Stay Healthy Corp." },
                { initiator: "Already in store insurance" },
            ],
        },
        {
            name: "mobile",
            type: TransactionType.Fixed,
            samples: [
                { initiator: "Mobilio Ltd." },
                { initiator: "stored phone company" },
            ],
        },
    ],
    startDate: "01.09.2021",
    endDate: "15.11.2021",
    storePath: dataJsonTestPath,
};

export const trendFromCsv: Configuration = {
    allowedLogLevel: "none",
    source: {
        type: "csv",
        path: __dirname + "/sample1.csv",
        dataKeys: {
            date: "booking",
            initiator: "initiator",
            purpose: "use",
            value: "amount",
        },
        backUpPath,
    },
    categories: [
        {
            name: "rent",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Rent for my crib" }],
        },
        {
            name: "insurance",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Stay Healthy Corp." }],
        },
        {
            name: "mobile",
            type: TransactionType.Fixed,
            samples: [{ initiator: "Mobilio Ltd." }],
        },
        {
            name: "shopping",
            type: TransactionType.Variable,
            samples: [
                { initiator: "my-online-shop.com" },
                { initiator: "cool-gadgets.com" },
            ],
        },
    ],
    storePath: dataJsonTestPath,
};
