import { parse, format } from "date-fns";

/**
 * Parses a dateString by a given format into a javascript Date object.
 *
 * @param dateString to parse into a Date
 * @param dateFormat that matches the date string, default is "dd.MM.yyyy",
 * see https://date-fns.org/v1.30.1/docs/format
 * @returns a javascript Date object or null
 */
export const parseDateString = (
    dateString: string | undefined,
    dateFormat = "dd.MM.yyyy",
): Date | null => {
    if (typeof dateString === "undefined") return null;
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
