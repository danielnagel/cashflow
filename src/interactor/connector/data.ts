import { isSameDay } from "date-fns";
import { isFile, loadFile, saveFile } from "../../utils/files";
import { isExtendedTransactionStore } from "../../utils/typeguards";

/**
 * Load and return file content with an extended transaction store
 * or null when it is not an extended transaction store
 *
 * @param path to the file
 * @returns extended transaction store
 *          or null when it is not an extended transaction store
 */
export const loadDataJson = (path: string): ExtendedTransactionStore | null => {
    if (!isFile(path)) {
        return null;
    }

    const content = loadFile(path);
    if (!content) return null;

    let result = null;
    try {
        result = JSON.parse(content);
    } catch (e: unknown) {
        throw new Error(`Could not parse content of '${path}'.`);
    }

    if (!isExtendedTransactionStore(result)) return null;

    // parse date strings to date objects
    result.extendedTransactions.forEach((t) => {
        t.date = new Date(t.date);
    });

    return result;
};

/**
 * Get latest transaction id or -1, if ther are no transactions stored.
 *
 * @param store to check
 * @returns latest transaction id, -1 otherwise
 */
export const getLatestTransactionId = (
    store: ExtendedTransactionStore | null,
): number => {
    if (!store) return -1;
    return store.latestEntry;
};

/**
 * Updates a file which contains an extended transaction store.
 * The new extended transactions are added to the store
 * and store meta data, latestEntry or size, is updated.
 *
 * @param path to a file which contains an extended transaction store
 * @param newExtendedTransactions which should be added to an extended transaction store
 */
export const updateDataJson = (
    path: string,
    newExtendedTransactions: ExtendedTransaction[],
): ExtendedTransactionStore | ApplicationError => {
    // empty default store
    let currentStore: ExtendedTransactionStore = {
        extendedTransactions: [],
        latestEntry: -1,
        size: 0,
    };

    if (isFile(path)) {
        try {
            const dataJson = loadDataJson(path);
            if (dataJson === null) {
                return {
                    source: "data.ts",
                    message: `Failed loading data.json.`,
                };
            }
            currentStore = dataJson;
        } catch (e: unknown) {
            if (e instanceof Error)
                return {
                    source: "data.ts",
                    message: `Failed loading data.json. Original message: "${e.message}"`,
                };
        }
    }

    const newStore = { ...currentStore };
    if (newExtendedTransactions.length > 0) {
        const latestEntryId = currentStore.latestEntry;
        if (latestEntryId + 1 !== newExtendedTransactions[0].id) {
            throw new Error(
                `New extended transactions array id mismatch. Next id should be '${
                    latestEntryId + 1
                }', given was '${newExtendedTransactions[0].id}'.`,
            );
        }
        newStore.extendedTransactions = mergeExtendedTransactions(
            currentStore.extendedTransactions,
            newExtendedTransactions,
        );
    }

    newStore.size = newStore.extendedTransactions.length;

    if (newStore.size > 0) {
        newStore.latestEntry =
            newStore.extendedTransactions[
                newStore.extendedTransactions.length - 1
            ].id;
    }

    saveFile(JSON.stringify(newStore, null, 2), path);
    return newStore;
};

const mergeExtendedTransactions = (
    extendedTransactions: ExtendedTransaction[],
    newExtendedTransactions: ExtendedTransaction[],
): ExtendedTransaction[] => {
    const unknownNewExtendedTransactions: ExtendedTransaction[] = [];
    for (const net of newExtendedTransactions) {
        let isUnknown = true;
        for (const et of extendedTransactions) {
            if (isSameExtendedTransaction(et, net)) {
                isUnknown = false;
                break;
            }
        }
        if (isUnknown) {
            unknownNewExtendedTransactions.push(net);
        }
    }

    const mergedExtendedTransactions = [
        ...extendedTransactions,
        ...unknownNewExtendedTransactions,
    ];

    return mergedExtendedTransactions;
};

const isSameExtendedTransaction = (
    a: ExtendedTransaction,
    b: ExtendedTransaction,
): boolean =>
    isSameDay(a.date, b.date) &&
    a.initiator === b.initiator &&
    a.purpose === b.purpose &&
    a.value === b.value;
