import bb, { area } from "billboard.js";
import { isApplicationError } from "../../../utils/typeguards";
import { TransactionType } from "../../../types/enums";

// aus summary

const getTransactionTypeData = (
    table: TrendReportTableRow[] | ApplicationError | null,
    transactionType: string,
): Array<string | number> => {
    const result: Array<string | number> = [];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    for (const row of table) {
        if (row.category === transactionType) {
            result.push(row.category);
            for (const value of Object.values(row)) {
                if (value === transactionType || value === null) continue;
                let number = parseFloat(value.substring(0, value.length - 2));
                if (number < 0) number *= -1;
                result.push(number);
            }
        }
    }
    return result;
};

const getVariableData = (
    table: TrendReportTableRow[] | ApplicationError | null,
): Array<Array<string | number>> => {
    const result: Array<Array<string | number>> = [];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    for (const row of table) {
        const resultRow: Array<string | number> = [];
        resultRow.push(row.category);
        for (const value of Object.values(row)) {
            if (!value) continue;
            let number = parseFloat(value.substring(0, value.length - 2));
            if (isNaN(number)) continue;
            if (number < 0) number *= -1;
            resultRow.push(number);
        }
        if (resultRow.length > 0) result.push(resultRow);
    }
    return result;
};

const getX = (
    table: TrendReportTableRow[] | ApplicationError | null,
): string[] => {
    const result = ["x"];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    const firstRow = table[0];
    for (const key of Object.keys(firstRow)) {
        if (key === "category") continue;
        result.push(key);
    }
    return result;
};

export const generateTrendTypeColumns = (
    table: TrendReportTableRow[] | ApplicationError | null,
): Array<Array<string | number>> => {
    const xAxis = getX(table);
    const incomeData = getTransactionTypeData(table, TransactionType.Income);
    const variableData = getTransactionTypeData(
        table,
        TransactionType.Variable,
    );
    const fixedData = getTransactionTypeData(table, TransactionType.Fixed);

    return [xAxis, incomeData, variableData, fixedData];
};

export const generateVariableTrendColumns = (
    table: TrendReportTableRow[] | ApplicationError | null,
): Array<Array<string | number>> => {
    const xAxis = getX(table);
    const data = getVariableData(table);
    return [xAxis, ...data];
};

export const generateAreaChart = (
    columns: Array<Array<string | number>>,
    bindto: string,
    groups?: string[][],
    filter?: (v: unknown) => boolean,
) => {
    bb.generate({
        data: {
            x: "x",
            columns,
            type: area(),
            groups,
            filter,
        },
        axis: {
            x: {
                type: "timeseries",
                tick: {
                    format: "%m.%Y",
                },
            },
        },
        bindto,
    });
};
