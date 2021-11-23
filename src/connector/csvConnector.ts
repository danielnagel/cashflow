import { existsSync, createReadStream } from "fs"
import parse from "csv-parse/lib/index";
import { germanDecimalNumberToFloat } from "src/utils/numbers";

export const fileExists = (path: string): boolean => {
    return existsSync(path);
}

export const parseRecordToTransaction = (record: UnknownRecord, dataKeys: DataKeys): Transaction | null => {
    const date = record[dataKeys.date];
    if (typeof date === "undefined") return null;

    const initiator = record[dataKeys.initiator];
    if (typeof initiator === "undefined") return null;

    const purpose = record[dataKeys.purpose];
    if (typeof purpose === "undefined") return null;

    const value = record[dataKeys.value];
    if (typeof value === "undefined") return null;

    const splitDate = date.split(".");
    if (splitDate.length !== 3) return null;

    const day = parseInt(splitDate[0]);
    const month = parseInt(splitDate[1]);
    const year = parseInt(splitDate[2]);
    const parsedValue = germanDecimalNumberToFloat(value);
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(parsedValue)) return null;

    return { initiator, purpose, value: parsedValue, day, month, year };
}

export const loadTransactionData = async (path: string, dataKeys: DataKeys, columns: string[]): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    if (!fileExists(path)) return transactions;

    const parser = createReadStream(path, { encoding: "latin1" }).pipe(parse({ delimiter: ";", columns, relaxColumnCount: true, skipEmptyLines: true }));

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(record, dataKeys);
        if (!transaction) continue;
        transactions.push(transaction);
    }

    return transactions;
}