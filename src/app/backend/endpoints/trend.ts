import { loadCategorizedTransactions } from "../../../interactor/interactor";
import { generateTrendReport } from "../../../interactor/report/trend";
import { isApplicationError } from "../../../utils/typeguards";

export const getTrend = async (
    options: Configuration,
    args: Arguments,
): Promise<TrendReport | ApplicationError> => {
    const transactions = await loadCategorizedTransactions(options);
    if (isApplicationError(transactions)) {
        return transactions;
    }

    return generateTrendReport(transactions, options, args);
};
