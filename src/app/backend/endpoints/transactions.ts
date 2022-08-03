import { loadCategorizedTransactions } from "../../../interactor/interactor";
import { LogLevel } from "../../../types/enums";
import { log } from "../../../utils/loggers";
import { sortTransactionsByDate } from "../../../utils/sorters";
import { isApplicationError } from "../../../utils/typeguards";

export const getAllTransactions = async (
    options: Configuration,
): Promise<ExtendedTransaction[]> => {
    const transactions = await loadCategorizedTransactions(options);
    if (isApplicationError(transactions)) {
        log({ level: LogLevel.Error, message: transactions });
        return [];
    }

    sortTransactionsByDate(transactions, true);

    return transactions;
};
