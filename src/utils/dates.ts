import { parse } from "date-fns";

export const getTimeStampFromTransaction = (transaction: Transaction): number => {
    return new Date(transaction.year, transaction.month - 1, transaction.day).getTime();
}

export const parseDateString = (dateString: string, dateFormat: string): Date | null => {
    let parsedDate: Date | null = null;
    try {
        parsedDate = parse(dateString, dateFormat, new Date());
        if (isNaN(parsedDate.getTime())) parsedDate = null;
    } catch (e) {
        let errorMessage = `Invalid date format: '${dateFormat}'.`;
        if (e instanceof Error)
            errorMessage += ` Original message: ${e.message}`;
        console.error(errorMessage);
    }
    return parsedDate
}