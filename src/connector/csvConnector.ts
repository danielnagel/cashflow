import { createReadStream } from "fs"
import parse from "csv-parse/lib/index";
import { fileExists } from "../utils/files";
import { decimalNumberToFloat, germanDecimalNumberToFloat } from "../utils/numbers";

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
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    let parsedValue = germanDecimalNumberToFloat(value);
    if (isNaN(parsedValue)) {
        parsedValue = decimalNumberToFloat(value);
        if (isNaN(parsedValue)) return null;
    }

    return { initiator, purpose, value: parsedValue, day, month, year };
}

export const loadTransactionData = async (options: CsvOptions): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    if (!fileExists(options.path)) return transactions;

    const parser = createReadStream(options.path, { encoding: "latin1" }).pipe(parse({ delimiter: ";", columns: options.columns, relaxColumnCount: true, skipEmptyLines: true }));

    for await (const record of parser) {
        const transaction = parseRecordToTransaction(record, options.dataKeys);
        if (!transaction) continue;
        transactions.push(transaction);
    }

    return transactions;
}