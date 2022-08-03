import { TransactionType } from "../../src/types/enums";
import {
    filterDoubleTransactions,
    filterTransactionsByDateString,
    filterTransactionsByCategoryName,
    filterTransactionsByCategoryType,
    filterTransactionsByPeriod,
    isTransactionMatchingSample,
    getLatestTransactionDate,
    getOldestTransactionDate,
} from "../../src/utils/filters";
import {
    transactions,
    transactionsA,
    transactionsB,
    categorizedTransactions,
} from "./samples/transactions";

import {
    expectedFilteredTransaction1,
    expectedFilteredTransaction2,
    expectedFilteredTransaction3,
    expectedFilteredTransaction4,
    expectedFilteredTransaction5,
    expectedFilteredTransaction6,
    expectedSingleTransaction1,
    expectedSingleTransaction2,
    expectedSingleTransaction3,
    expectedSingleTransaction4,
    expectedSingleTransaction5,
    expectedSingleTransaction6,
    expectedFilteredTransaction7,
    expectedSmallTransactionList1,
    expectedSmallTransactionList2,
} from "./samples/expected";

describe("Test utils/filters", () => {
    describe("Test function filterTransactionsByDateString", () => {
        describe("Test falsy parameters", () => {
            test("Return an array of length 0, if there are no transactions", () => {
                expect(
                    filterTransactionsByDateString([], {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.2021",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if there aren't any transactions that match 'before date' option", () => {
                expect(
                    filterTransactionsByDateString(transactions, {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.1999",
                    }),
                ).toHaveLength(0);
            });

            test("Return an array of length 0, if 'before date' is after 'after date' option", () => {
                expect(
                    filterTransactionsByDateString(transactions, {
                        source: { type: "api" },
                        categories: [],
                        endDate: "15.12.1999",
                        startDate: "12.07.2002",
                    }),
                ).toHaveLength(0);
            });

            test("Return unfiltered transactions, if 'end date' option can't be parsed", () => {
                const result = filterTransactionsByDateString(transactions, {
                    source: { type: "api" },
                    categories: [],
                    endDate: "13/12/991",
                });
                expect(result).toHaveLength(transactions.length);
                expect(result).toStrictEqual(transactions);
            });

            test("Return unfiltered transactions, if 'start date' option can't be parsed", () => {
                const result = filterTransactionsByDateString(transactions, {
                    source: { type: "api" },
                    categories: [],
                    startDate: "13/12/991",
                });
                expect(result).toHaveLength(transactions.length);
                expect(result).toStrictEqual(transactions);
            });
        });

        describe("Test filtering transactions by exactly one sample", () => {
            test("Filter transactions until 'before date' ", () => {
                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "02.06.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(
                    expectedFilteredTransaction1.length,
                );
                expect(filteredTransactions).toStrictEqual(
                    expectedFilteredTransaction1,
                );
            });

            test("Filter transactions from 'after date' ", () => {
                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        source: { type: "api" },
                        categories: [],
                        startDate: "20.11.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(
                    expectedFilteredTransaction2.length,
                );
                expect(filteredTransactions).toStrictEqual(
                    expectedFilteredTransaction2,
                );
            });

            test("Filter transactions from 'before date' to 'after date'", () => {
                const filteredTransactions = filterTransactionsByDateString(
                    transactions,
                    {
                        source: { type: "api" },
                        categories: [],
                        endDate: "01.12.2021",
                        startDate: "20.11.2021",
                    },
                );
                expect(filteredTransactions).toHaveLength(
                    expectedFilteredTransaction3.length,
                );
                expect(filteredTransactions).toStrictEqual(
                    expectedFilteredTransaction3,
                );
            });
        });
    });

    describe("Test function filterDoubleTransactions", () => {
        test("Filter double transaction from two transactions", () => {
            const filteredTransactions = filterDoubleTransactions(
                transactionsA,
                transactionsB,
            );
            expect(filteredTransactions).toHaveLength(transactions.length);
            expect(filteredTransactions).toStrictEqual(transactions);
        });
    });

    describe("Test filtering of categorized transactions", () => {
        describe("Test filtering of uncategorized transaction lists", () => {
            describe("Test function filterTransactionsByCategoryType", () => {
                test("Return empty array, when transactions array is uncategorized", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            transactions,
                            TransactionType.Fixed,
                        );
                    expect(filteredTransactions).toHaveLength(0);
                });
            });

            describe("Test function filterTransactionsByCategoryName", () => {
                test("Return empty array, when transactions array is uncategorized", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryName(transactions, "rent");
                    expect(filteredTransactions).toHaveLength(0);
                });
            });
        });

        describe("Test filtering of categorized transaction lists", () => {
            describe("Test function filterTransactionsByCategoryType", () => {
                test("Return filtered list by category type fixed", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            categorizedTransactions,
                            TransactionType.Fixed,
                        );
                    expect(filteredTransactions).toHaveLength(
                        expectedFilteredTransaction4.length,
                    );
                    expect(filteredTransactions).toStrictEqual(
                        expectedFilteredTransaction4,
                    );
                });

                test("Return filtered list by category type variable", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryType(
                            categorizedTransactions,
                            TransactionType.Variable,
                        );

                    expect(filteredTransactions).toHaveLength(
                        expectedFilteredTransaction5.length,
                    );
                    expect(filteredTransactions).toStrictEqual(
                        expectedFilteredTransaction5,
                    );
                });
            });

            describe("Test function filterTransactionsByCategoryName", () => {
                test("Return filtered list by category name", () => {
                    const filteredTransactions =
                        filterTransactionsByCategoryName(
                            categorizedTransactions,
                            "food",
                        );
                    expect(filteredTransactions).toHaveLength(
                        expectedFilteredTransaction6.length,
                    );
                    expect(filteredTransactions).toStrictEqual(
                        expectedFilteredTransaction6,
                    );
                });
            });

            describe("Test function filterTransactionsByPeriod", () => {
                test("Return empty list if period did not match", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2019.11",
                    );
                    expect(filteredTransactions).toHaveLength(0);
                });
                test("Return empty list if period couldn't be parsed", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2021/11",
                    );
                    expect(filteredTransactions).toHaveLength(0);
                });

                test("Return filtered list by period", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "2021.06",
                    );

                    expect(filteredTransactions).toHaveLength(
                        expectedFilteredTransaction7.length,
                    );
                    expect(filteredTransactions).toStrictEqual(
                        expectedFilteredTransaction7,
                    );
                });

                test("Return filtered list by period, change date format", () => {
                    const filteredTransactions = filterTransactionsByPeriod(
                        transactions,
                        "21/06",
                        "yy/MM",
                    );
                    expect(filteredTransactions).toHaveLength(
                        expectedFilteredTransaction7.length,
                    );
                    expect(filteredTransactions).toStrictEqual(
                        expectedFilteredTransaction7,
                    );
                });
            });
        });
    });
    describe("Test matching of samples", () => {
        test("Match transaction with exact sample", () => {
            const sample: Sample = { initiator: "Grocerie Land" };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction1, sample),
            ).toBeTruthy();
        });

        test("Don't match transaction with false sample", () => {
            const sample: Sample = { initiator: "test" };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction2, sample),
            ).toBeFalsy();
        });

        test("Matching initiators with unique purposes", () => {
            const sample: Sample = {
                initiator: "Grocerie Land",
                purpose: "grocerie",
            };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction3, sample),
            ).toBeTruthy();
        });

        test("Matching initiator with like match", () => {
            const sample: Sample = {
                initiator: "~Land",
            };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction4, sample),
            ).toBeTruthy();
        });

        test("Matching initiator explicitly without purpose", () => {
            const sample: Sample = {
                initiator: "~Land",
                purpose: null,
            };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction5, sample),
            ).toBeTruthy();
        });

        test("Not matching initiator, which has a purpose, explicitly without purpose", () => {
            const sample: Sample = {
                initiator: "~Land",
                purpose: null,
            };
            expect(
                isTransactionMatchingSample(expectedSingleTransaction6, sample),
            ).toBeFalsy();
        });
    });

    describe("Test getting latest date from a list of transactions", () => {
        test("Return null, if transactions list is null", () => {
            expect(getLatestTransactionDate([])).toBeNull();
        });
        test("Return date of latest transaction, in a list of one transaction", () => {
            expect(
                getLatestTransactionDate(expectedSmallTransactionList1),
            ).toStrictEqual(new Date(2021, 8, 7));
        });

        test("Return date of latest transaction, in a list of multiple transaction", () => {
            expect(getLatestTransactionDate(transactions)).toStrictEqual(
                new Date(2021, 11, 3),
            );
        });
    });

    describe("Test getting oldest date from a list of transactions", () => {
        test("Return null, if transactions list is null", () => {
            expect(getOldestTransactionDate([])).toBeNull();
        });
        test("Return date of oldest transaction, in a list of one transaction", () => {
            expect(
                getOldestTransactionDate(expectedSmallTransactionList2),
            ).toStrictEqual(new Date(2021, 8, 7));
        });

        test("Return date of oldest transaction, in a list of multiple transaction", () => {
            expect(getOldestTransactionDate(transactions)).toStrictEqual(
                new Date(2021, 5, 1),
            );
        });
    });
});
