import { rmSync, existsSync, writeFileSync } from "fs";
import {
    getLatestTransactionId,
    loadDataJson,
    updateDataJson,
} from "../../../src/interactor/connector/data";
import { isExtendedTransactionStore } from "../../../src/utils/typeguards";
import {
    emptyExtendedTransactionStore,
    extendedTransactionStore,
} from "./samples/expected";

describe("Test connector/data", () => {
    const dataJsonTestPath = __dirname + "/samples/data.json";

    beforeEach(() => {
        if (existsSync(dataJsonTestPath)) rmSync(dataJsonTestPath);
    });

    afterAll(() => {
        if (existsSync(dataJsonTestPath)) rmSync(dataJsonTestPath);
    });

    describe("Loading extended transaction store", () => {
        test("Create extended transaction store (data.json), when there is none", () => {
            expect(existsSync(dataJsonTestPath)).toBeFalsy();
            loadDataJson(dataJsonTestPath);
            expect(existsSync(dataJsonTestPath)).toBeTruthy();
        });

        test("Return extended transaction store, when there is one", () => {
            // create store
            const content = JSON.stringify(extendedTransactionStore);
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            const result = loadDataJson(dataJsonTestPath);
            expect(isExtendedTransactionStore(result)).toBeTruthy();
        });

        test("Return null, when given path is an empty file", () => {
            // create store
            const content = "";
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            expect(loadDataJson(dataJsonTestPath)).toBeNull();
        });

        test("Throw error, when given path is unparsable", () => {
            // create store
            const content = "{ error; blub {";
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            expect(() => loadDataJson(dataJsonTestPath)).toThrowError(
                `Could not parse content of '${dataJsonTestPath}'.`,
            );
        });
    });

    describe("Get latest transaction id from extended transaction store", () => {
        test("Return -1, when the store is null", () => {
            expect(getLatestTransactionId(null)).toBe(-1);
        });

        test("Return -1, when there are no transactions in store", () => {
            expect(getLatestTransactionId(emptyExtendedTransactionStore)).toBe(
                -1,
            );
        });

        test("Return latest transaction id, when there are transactions in store", () => {
            expect(getLatestTransactionId(extendedTransactionStore)).toBe(3);
        });
    });

    describe("Update extended transaction store", () => {
        test("Write empty extended transaction store, when there is no extended transaction store (data.json)", () => {
            expect(existsSync(dataJsonTestPath)).toBeFalsy();
            updateDataJson(dataJsonTestPath, []);
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            const result = loadDataJson(dataJsonTestPath);
            expect(isExtendedTransactionStore(result)).toBeTruthy();
            expect(result).toStrictEqual(emptyExtendedTransactionStore);
        });

        test("Write empty extended transaction store, when there are no transactions", () => {
            loadDataJson(dataJsonTestPath);
            expect(existsSync(dataJsonTestPath)).toBeTruthy();
            updateDataJson(dataJsonTestPath, []);

            const result = loadDataJson(dataJsonTestPath);
            expect(isExtendedTransactionStore(result)).toBeTruthy();
            expect(result).toStrictEqual(emptyExtendedTransactionStore);
        });

        test("Throw error, when given path is unparsable", () => {
            // create store
            const content = "{ error; blub {";
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            const newExtendedTransactions = [
                {
                    id: 4,
                    date: new Date(2021, 10, 11),
                    initiator: "Presentable Presents",
                    purpose: "Good luck!",
                    value: 199.78,
                    category: { name: "presents", type: "variable" },
                },
            ];

            expect(() =>
                updateDataJson(dataJsonTestPath, newExtendedTransactions),
            ).toThrowError(`Could not parse content of '${dataJsonTestPath}'.`);
        });

        test("Append data.json, when there are already transactions stored", () => {
            // create store
            const content = JSON.stringify(extendedTransactionStore);
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            const newExtendedTransactions = [
                {
                    id: 4,
                    date: new Date(2021, 10, 11),
                    initiator: "Presentable Presents",
                    purpose: "Good luck!",
                    value: 199.78,
                    category: { name: "presents", type: "variable" },
                },
                {
                    id: 5,
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
            ];

            updateDataJson(dataJsonTestPath, newExtendedTransactions);

            const result = loadDataJson(dataJsonTestPath);
            expect(isExtendedTransactionStore(result)).toBeTruthy();

            const expectedStore = { ...extendedTransactionStore };
            expectedStore.extendedTransactions = [
                ...expectedStore.extendedTransactions,
                ...newExtendedTransactions,
            ];
            expectedStore.latestEntry = 5;
            expectedStore.size = 6;

            expect(result).toStrictEqual(expectedStore);
        });

        test("Throw error, when extended transaction array does not have to correct id", () => {
            // create store
            const content = JSON.stringify(extendedTransactionStore);
            writeFileSync(dataJsonTestPath, content, {
                encoding: "utf-8",
                flag: "w+",
            });
            expect(existsSync(dataJsonTestPath)).toBeTruthy();

            const newExtendedTransactions = [
                {
                    id: 5,
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
            ];

            expect(() =>
                updateDataJson(dataJsonTestPath, newExtendedTransactions),
            ).toThrowError(
                `New extended transactions array id mismatch. Next id should be '4', given was '5'.`,
            );
        });
    });
});
