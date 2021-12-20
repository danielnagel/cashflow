import {
    filterDoubleTransactions,
    isTransactionMatchingSample,
} from "../../utils/filters";

export const categorizeTransaction = (
    transactions: Transaction[],
    categories: SampledCategory[],
): Transaction[] | ApplicationError => {
    if (transactions.length === 0) return [];

    let copyOfTransactions = [...transactions];
    for (const category of categories) {
        for (const sample of category.samples) {
            for (const transaction of transactions) {
                if (isTransactionMatchingSample(transaction, sample)) {
                    const index = copyOfTransactions.indexOf(transaction);
                    copyOfTransactions.splice(index, 1);
                    transaction.category = {
                        name: category.name,
                        type: category.type,
                        period: category.period,
                    };
                }
            }
        }
    }

    if (copyOfTransactions.length === transactions.length) {
        return {
            source: "categorize.ts",
            message: "Couldn't match any transaction.",
        };
    }

    if (copyOfTransactions.length > 0) {
        let message =
            "Couldn't match all transactions. Unmatched Transactions:";
        for (let i = 0; i < copyOfTransactions.length; i++) {
            if (i === copyOfTransactions.length - 1) {
                message += ` "${copyOfTransactions[i].initiator}".`;
            } else {
                message += ` "${copyOfTransactions[i].initiator}",`;
            }
        }
        return { source: "categorize.ts", message };
    }

    return transactions;
};
