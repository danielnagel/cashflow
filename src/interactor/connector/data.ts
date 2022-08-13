import { isFile, loadFile, saveFile } from "../../utils/files";
import { isExtendedTransactionStore } from "../../utils/typeguards";

/**
 * load data/data.json or create data/data.json, if it does not exist
 */
export const loadDataJson = (path: string): ExtendedTransactionStore | null => {
    if (!isFile(path)) {
        saveFile("", path);
        return null;
    }

    const content = loadFile(path);
    if (!content) return null;

    try {
        const result = JSON.parse(content);
        if (isExtendedTransactionStore(result)) {
            result.extendedTransactions.forEach((t) => {
                t.date = new Date(t.date);
            });
        }
        return result;
    } catch (e: unknown) {
        throw new Error(`Could not parse content of '${path}'.`);
    }
};

/**
 * get latest id or -1, if ther are no transactions stored
 * @param store
 */
export const getLatestTransactionId = (
    store: ExtendedTransactionStore | null,
): number => {
    if (!store) return -1;
    return store.latestEntry;
};

/**
 * update data.json
 * @param newExtendedTransactions
 */
export const updateDataJson = (
    path: string,
    newExtendedTransactions: ExtendedTransaction[],
) => {
    if (!isFile(path) || newExtendedTransactions.length === 0) {
        const emptyExtendedTransactionStore: ExtendedTransactionStore = {
            extendedTransactions: [],
            latestEntry: -1,
            size: 0,
        };
        saveFile(JSON.stringify(emptyExtendedTransactionStore, null, 2), path);
        return;
    }

    let currentStore = null;
    try {
        currentStore = loadDataJson(path);
    } catch (e: unknown) {
        if (e instanceof Error) throw new Error(e.message);
    }

    if (isExtendedTransactionStore(currentStore)) {
        const latestEntryId = currentStore.latestEntry;
        if (latestEntryId + 1 !== newExtendedTransactions[0].id) {
            throw new Error(
                `New extended transactions array id mismatch. Next id should be '${
                    latestEntryId + 1
                }', given was '${newExtendedTransactions[0].id}'.`,
            );
        }
        const newStore = { ...currentStore };
        newStore.extendedTransactions = [
            ...newStore.extendedTransactions,
            ...newExtendedTransactions,
        ];
        newStore.size = newStore.extendedTransactions.length;
        newStore.latestEntry =
            newStore.extendedTransactions[
                newStore.extendedTransactions.length - 1
            ].id;
        saveFile(JSON.stringify(newStore, null, 2), path);
    }
};
