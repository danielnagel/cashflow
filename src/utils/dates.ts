import { parse, format } from "date-fns";

/**
 * Creates a javascript Date object from a Transaction object.
 *
 * @param transaction to create the date from
 * @returns javascript Date object from a Transaction object
 */
export const getDateFromTransaction = (transaction: Transaction): Date => {
    return new Date(transaction.year, transaction.month - 1, transaction.day);
};

/**
 * Parses a dateString by a given format into a javascript Date object.
 *
 * @param dateString to parse into a Date
 * @param dateFormat that matches the date string, default is "dd.MM.yyyy",
 * see https://date-fns.org/v1.30.1/docs/format
 * @returns a javascript Date object or null
 */
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

/**
 * Formats a javascript Date object into a date string, by given format.
 *
 * @param date javascript Date object to format into a date string
 * @param dateFormat to use for creating the date string,
 * default is "dd.MM.yyyy", see https://date-fns.org/v1.30.1/docs/format
 * @returns a string or null
 */
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
