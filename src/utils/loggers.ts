import { formatDate } from "./dates";
import { isApplicationError } from "./typeguards";

/**
 * Logs a message by given options to a specific log handler
 *
 * @param options  that specify how to handle the log message
 * and which logger type to use
 */
export const log = (options: LogOptions): void => {
    // fallback
    consoleHandler(options);
};

/**
 * Logs a message to console, by given options.
 *
 * @param options that specify how to handle the log message
 */
const consoleHandler = (options: LogOptions): void => {
    if (isLogLevelAllowed(options.level, options.allowedLogLevel))
        console.log(
            formatLogMessage(
                options.message,
                options.level,
                options.dateTimeFormat,
            ),
        );
};

/**
 * Creates a log message in a specific format.
 *
 * @param message that should be logged
 * @param level log level, default is error
 * @param dateTimeFormat format to be used as timestamp,
 * default is "dd.MM.yyyy HH:mm:ss",
 * see https://date-fns.org/v1.30.1/docs/format
 * @returns a fomatted log message
 */
const formatLogMessage = (
    message: string | ApplicationError,
    level = "error",
    dateTimeFormat = "dd.MM.yyyy HH:mm:ss",
): string => {
    if (isApplicationError(message)) {
        message = `[${message.source}]: ${message.message}`;
    }
    return `${generateTimeStamp(dateTimeFormat)} {${level}} ${message}`;
};

/**
 * Generates a time stamp string
 *
 * @param dateTimeFormat format to be used as timestamp,
 * default is "dd.MM.yyyy HH:mm:ss",
 * see https://date-fns.org/v1.30.1/docs/format
 * @returns a time stamp string
 */
const generateTimeStamp = (dateTimeFormat = "dd.MM.yyyy HH:mm:ss"): string => {
    let dateTime = formatDate(new Date(), dateTimeFormat);
    if (!dateTime) dateTime = new Date().toLocaleDateString();
    return dateTime;
};

/**
 * Checks wheter a log level is allowed or not.
 *
 * @param level to checko
 * @param allowedLogLevel configured allowed log level
 * @returns true if level is allowed, false otherwise
 */
const isLogLevelAllowed = (
    level: string | undefined,
    allowedLogLevel: string | undefined,
): boolean => {
    switch (allowedLogLevel) {
        case "none":
            return false;
        case "info":
            return level !== "debug";
        case "warn":
            return level !== "debug" && level !== "info";
        case "error":
            return level !== "debug" && level !== "info" && level !== "warn";
        default:
            return true;
    }
};
