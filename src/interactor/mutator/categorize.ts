import { isTransactionMatchingSample } from "../../utils/filters";
import { isApplicationError } from "../../utils/typeguards";

/**
 * Categorizes every transaction in a list of transactions.
 * Adds a category object to a transaction object.
 *
 * @param transactions
 * @param categories that match transactions
 * @returns A list of transactions with added category objects or
 * an ApplicationError, when not all transactions matched.
 */
export const categorizeTransaction = (
    transactions: Transaction[],
    categories: SampledCategory[],
): Transaction[] | ApplicationError => {
    if (transactions.length === 0) return [];

    const copyOfTransactions = copy(transactions);
    for (const category of categories) {
        for (const sample of category.samples) {
            for (const transaction of copyOfTransactions) {
                if (isTransactionMatchingSample(transaction, sample)) {
                    transaction.category = {
                        name: category.name,
                        type: category.type,
                        period: category.period,
                    };
                }
            }
        }
    }

    const error = generateError(copyOfTransactions);
    if (isApplicationError(error)) {
        return error;
    }

    return copyOfTransactions;
};

const copy = (transactions: Transaction[]): Transaction[] => {
    const copyOfTransactions: Transaction[] = [];

    for (const transaction of transactions) {
        copyOfTransactions.push({ ...transaction });
    }

    return copyOfTransactions;
};

const generateError = (
    transactions: Transaction[],
): ApplicationError | null => {
    let message = "Couldn't match any transaction.";

    const unmatchedTransactions: Transaction[] = [];
    for (const transaction of transactions) {
        if (typeof transaction.category === "undefined") {
            unmatchedTransactions.push(transaction);
        }
    }

    if (unmatchedTransactions.length === 0) return null;

    if (unmatchedTransactions.length < transactions.length) {
        message = "Couldn't match all transactions. Unmatched Transactions:";
        for (let i = 0; i < unmatchedTransactions.length; i++) {
            if (i === unmatchedTransactions.length - 1) {
                message += ` "${unmatchedTransactions[i].initiator}".`;
            } else {
                message += ` "${unmatchedTransactions[i].initiator}",`;
            }
        }
    }

    return { source: "categorize.ts", message };
};
