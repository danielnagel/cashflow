import { Periods, TransactionType } from "../../types/enums";
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
): Transaction[] | ApplicationError => {
    if (transactions.length === 0) return [];

    const copyOfTransactions = copy(transactions);
    for (const category of options.categories) {
        for (const sample of category.samples) {
            for (const transaction of copyOfTransactions) {
                if (isTransactionMatchingSample(transaction, sample)) {
                    transaction.category = {
                        name: category.name,
                        type: category.type,
                    };
                    if (
                        category.type === TransactionType.Fixed ||
                        category.type === TransactionType.Income
                    ) {
                        transaction.category.period = Periods.Monthly;
                        if (typeof category.period !== "undefined") {
                            transaction.category.period = category.period;
                        }
                    }
                }
            }
        }
    }

    const unmatchedTransactions = getUnmatchedTransactions(copyOfTransactions);
    if (options.strict && unmatchedTransactions.length > 0) {
        const error = generateError(copyOfTransactions, unmatchedTransactions);
        if (isApplicationError(error)) {
            return error;
        }
    }

    if (!options.strict && unmatchedTransactions.length > 0) {
        for (const transaction of copyOfTransactions) {
            if (typeof transaction.category === "undefined") {
                transaction.category = {
                    name: "unmatched",
                    type: TransactionType.Variable,
                };
            }
        }
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
    unmatchedTransactions: Transaction[],
): ApplicationError => {
    let message = "Couldn't match any transaction.";

    if (unmatchedTransactions.length < transactions.length) {
        message = "Couldn't match all transactions. Unmatched Transactions:";
        for (let i = 0; i < unmatchedTransactions.length; i++) {
            if (i === unmatchedTransactions.length - 1) {
                message += ` "${unmatchedTransactions[i].initiator};${unmatchedTransactions[i].purpose}".`;
            } else {
                message += ` "${unmatchedTransactions[i].initiator};${unmatchedTransactions[i].purpose}",`;
            }
        }
    }

    return { source: "categorize.ts", message };
};

const getUnmatchedTransactions = (
    transactions: Transaction[],
): Transaction[] => {
    const unmatchedTransactions: Transaction[] = [];
    for (const transaction of transactions) {
        if (typeof transaction.category === "undefined") {
            unmatchedTransactions.push(transaction);
        }
    }
    return unmatchedTransactions;
};
