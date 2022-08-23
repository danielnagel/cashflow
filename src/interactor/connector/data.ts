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
): void => {
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
        newStore.extendedTransactions = mergeExtendedTransactions(
            currentStore.extendedTransactions,
            newExtendedTransactions,
        );
        newStore.size = newStore.extendedTransactions.length;
        newStore.latestEntry =
            newStore.extendedTransactions[
                newStore.extendedTransactions.length - 1
            ].id;
        saveFile(JSON.stringify(newStore, null, 2), path);
    }
};

const mergeExtendedTransactions = (
    extendedTransactions: ExtendedTransaction[],
    newExtendedTransactions: ExtendedTransaction[],
): ExtendedTransaction[] => {
    if (
        extendedTransactions.length === 0 &&
        newExtendedTransactions.length === 0
    )
        return [];

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
    a.id === b.id &&
    a.initiator === b.initiator &&
    a.purpose === b.purpose &&
    a.value === b.value;
