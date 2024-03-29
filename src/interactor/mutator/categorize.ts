import { Periods, TransactionType } from "../../types/enums";
import { formatDate } from "../../utils/dates";
import { createDirectory, saveFile } from "../../utils/files";
import { isTransactionMatchingSample } from "../../utils/filters";
import { isApplicationError } from "../../utils/typeguards";

/**
 * Categorizes every transaction in a list of transactions.
 * Adds a category object to a transaction object.
 *
 * @param transactions
 * @param options contains a list of categories to be matched and
 * the option skipErrors. When true,
 * all unmatched transaction get the category "unmatched",
 * otherwise an ApplicationError is produced.
 * @returns A list of transactions with added category objects or
 * an ApplicationError, when not all transactions matched.
 */
export const categorizeTransaction = (
    transactions: Transaction[],
    options: Configuration,
    id = 0,
): ExtendedTransaction[] | ApplicationError => {
    if (transactions.length === 0) return [];

    const copyOfTransactions = copy(transactions);
    const extendedTransactions: ExtendedTransaction[] = [];

    for (const transaction of copyOfTransactions) {
        const et: ExtendedTransaction = {
            ...transaction,
            id,
            category: {
                name: "unmatched",
                type: TransactionType.Variable,
            },
        };
        id++;
        for (const category of options.categories) {
            for (const sample of category.samples) {
                if (isTransactionMatchingSample(transaction, sample)) {
                    et.category.name = category.name;
                    et.category.type = category.type;
                    if (
                        category.type === TransactionType.Fixed ||
                        category.type === TransactionType.Income
                    ) {
                        et.category.period = Periods.Monthly;
                        if (typeof category.period !== "undefined") {
                            et.category.period = category.period;
                        }
                    }
                }
            }
        }
        extendedTransactions.push(et);
    }

    const unmatchedTransactions =
        getUnmatchedTransactions(extendedTransactions);
    if (options.strict && unmatchedTransactions.length > 0) {
        const error = generateError(unmatchedTransactions);
        if (isApplicationError(error)) {
            return error;
        }
    }

    return extendedTransactions;
};

const copy = (transactions: Transaction[]): Transaction[] => {
    const copyOfTransactions: Transaction[] = [];

    for (const transaction of transactions) {
        copyOfTransactions.push({ ...transaction });
    }

    return copyOfTransactions;
};

const generateError = (
    unmatchedTransactions: Transaction[],
): ApplicationError => {
    const fileName = `${formatDate(new Date(), "yyyy-MM-dd")}-unmatched.json`;
    const path = "data/logs/";
    createDirectory(path);
    saveFile(JSON.stringify(unmatchedTransactions, null, 2), path + fileName);

    return {
        source: "categorize.ts",
        message: `Couldn't match all transactions. See ${
            path + fileName
        } for details.`,
    };
};

const getUnmatchedTransactions = (
    transactions: ExtendedTransaction[],
): ExtendedTransaction[] => {
    const unmatchedTransactions: ExtendedTransaction[] = [];
    for (const transaction of transactions) {
        if (transaction.category.name === "unmatched") {
            unmatchedTransactions.push(transaction);
        }
    }
    return unmatchedTransactions;
};
