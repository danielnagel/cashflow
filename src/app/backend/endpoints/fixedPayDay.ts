import { loadCategorizedTransactions } from "../../../interactor/interactor";
import { generateFixedPayDayReport } from "../../../interactor/report/fixedPayDay";
import { isApplicationError } from "../../../utils/typeguards";

export const getFixedPayDay = async (
    options: Configuration,
): Promise<CategorizedFixedPayDays | ApplicationError> => {
    const transactions = await loadCategorizedTransactions(options);
    if (isApplicationError(transactions)) {
        return transactions;
    }

    return generateFixedPayDayReport(transactions, options);
};
