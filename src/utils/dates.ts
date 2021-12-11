import { parse, format } from "date-fns";

export const getTimeStampFromTransaction = (
    transaction: Transaction,
): number => {
    return new Date(
        transaction.year,
        transaction.month - 1,
        transaction.day,
    ).getTime();
};

export const parseDateString = (
    dateString: string,
    dateFormat = "dd.MM.yyyy",
): Date | null => {
    let parsedDate: Date | null = null;
    try {
        parsedDate = parse(dateString, dateFormat, new Date());
        if (isNaN(parsedDate.getTime())) parsedDate = null;
    } finally {
        return parsedDate;
    }
};

export const formatDate = (
    date: Date,
    dateFormat = "dd.MM.yyyy",
): string | null => {
    let formattedDate: string | null = null;
    try {
        formattedDate = format(date, dateFormat);
    } finally {
        return formattedDate;
    }
};
