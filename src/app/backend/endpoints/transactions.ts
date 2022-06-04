import { loadCategorizedTransactions } from "../../../interactor/interactor";
import { LogLevel } from "../../../types/enums";
import { log } from "../../../utils/loggers";
import { isApplicationError } from "../../../utils/typeguards";

export const getAllTransactions = async (
    options: Configuration,
): Promise<Transaction[]> => {
    const transactions = await loadCategorizedTransactions(options);
    if (isApplicationError(transactions)) {
        log({ level: LogLevel.Error, message: transactions });
        return [];
    }

    return transactions;
};
