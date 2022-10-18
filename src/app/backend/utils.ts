import { TransactionType } from "../../types/enums";
import {
    getFixedPayDay,
    getAllTransactions,
    getTrendReportTable,
} from "./endpoints";
import { isApplicationError } from "../../utils/typeguards";

export const loadCache = async (
    args: Arguments,
    options: Configuration,
): Promise<BackendCache | ApplicationError> => {
    const transactions = await getAllTransactions(options, { ...args });
    if (isApplicationError(transactions) && options.strict) {
        return transactions;
    }
    const fixedPayDay = await getFixedPayDay(options, { ...args });
    const allTrends = await getTrendReportTable(options, {
        ...args,
        trendType: undefined,
    });
    const variableTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Variable,
    });
    const fixedTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Fixed,
    });
    const incomeTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Income,
    });
    const specialTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Special,
    });

    return {
        transactions,
        fixedPayDay,
        allTrends,
        variableTrend,
        fixedTrend,
        incomeTrend,
        specialTrend,
    };
};
