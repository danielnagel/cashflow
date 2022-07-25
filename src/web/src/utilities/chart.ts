import bb, { area } from "billboard.js";
import { isApplicationError } from "../../../utils/typeguards";
import { TransactionType } from "../../../types/enums";
import { parseDateString, formatDate } from "../../../utils/dates";
import { FilterPeriod } from "./enums";

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
): Array<string | Date> => {
    const result: Array<string | Date> = ["x"];

    if (isApplicationError(table) || table === null) {
        return result;
    }

    const firstRow = table[0];
    for (const key of Object.keys(firstRow)) {
        if (key === "category") continue;
        const date = parseDateString(key, "yyyy.MM");
        if (date === null) continue;
        result.push(date);
    }
    return result;
};

export const generateTrendTypeColumns = (
    table: TrendReportTableRow[] | ApplicationError | null,
    period: string,
): Array<Array<string | number | Date>> => {
    const xAxis = getX(table);
    const incomeData = getTransactionTypeData(table, TransactionType.Income);
    const variableData = getTransactionTypeData(
        table,
        TransactionType.Variable,
    );
    const fixedData = getTransactionTypeData(table, TransactionType.Fixed);

    return filterByPeriod([xAxis, incomeData, variableData, fixedData], period);
};

const filterByPeriod = (
    columns: Array<Array<string | number | Date>>,
    period: string,
): Array<Array<string | number | Date>> => {
    switch (period) {
        case FilterPeriod.LastMonth:
            columns = getLatestPeriods(columns, 1);
            break;
        case FilterPeriod.LastQuarter:
            columns = getLatestPeriods(columns, 3);
            break;
        case FilterPeriod.LastYear:
            columns = getLatestPeriods(columns, 12);
            break;
        case FilterPeriod.NoPeriod:
        default:
        // do nothing
    }
    return columns;
};

const getLatestPeriods = (
    columns: Array<Array<string | number | Date>>,
    periods: number,
): Array<Array<string | number | Date>> => {
    if (columns.length === 0) return columns;

    const firstElements = columns.map((c) => {
        return c[0];
    });
    const firstElementLength = columns[0].length;

    const filteredColumns: Array<Array<string | number | Date>> = [];
    for (let i = 0; i < firstElements.length; i++) {
        for (
            let j = firstElementLength - 1;
            j >= firstElementLength - periods;
            j--
        ) {
            if (typeof filteredColumns[i] === "undefined")
                filteredColumns[i] = [firstElements[i], columns[i][j]];
            else filteredColumns[i].push(columns[i][j]);
        }
    }
    return filteredColumns;
};

export const generateVariableTrendColumns = (
    table: TrendReportTableRow[] | ApplicationError | null,
    period: string,
): Array<Array<string | number | Date>> => {
    const xAxis = getX(table);
    const data = getVariableData(table);
    return filterByPeriod([xAxis, ...data], period);
};

export const generateAreaChart = (
    columns: Array<Array<string | number | Date>>,
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
                localtime: false,
                tick: {
                    format: function (x: number | Date): string {
                        if (typeof x === "number") return x.toString();
                        const date = formatDate(x, "yyyy.MM");
                        if (date !== null) return date;
                        return x.toDateString();
                    },
                },
            },
        },
        bindto,
    });
};
