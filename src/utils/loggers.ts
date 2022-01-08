import { LogLevel, LogType } from "../types/enums";
import { formatDate } from "./dates";
import {
    appendFile,
    createDirectory,
    createFilePath,
    pathExists,
} from "./files";
import { isApplicationError } from "./typeguards";

/**
 * Logs a message by given options to a specific log handler
 *
 * @param options  that specify how to handle the log message
 * and which logger type to use
 */
export const log = (options: Log): void => {
    switch (options.type) {
        case LogType.File:
            fileHandler(options);
            break;
        default:
            // fallback
            consoleHandler(options);
    }
};

/**
 * Logs a message to console, by given options.
 *
 * @param options that specify how to handle the log message
 */
const consoleHandler = (options: Log): void => {
    if (isLogLevelAllowed(options.level, options.allowedLogLevel))
        console.log(formatLogMessage(options));
};

/**
 * Logs a message to file, by given options.
 *
 * @param options that specify how to handle the log message
 */
const fileHandler = (options: Log): void => {
    if (isLogLevelAllowed(options.level, options.allowedLogLevel)) {
        let path =
            typeof options.path === "string" ? options.path : "data/logs/";
        let formattedDate = formatDate(new Date(), "yyyy-MM-dd");
        if (formattedDate === null)
            formattedDate = new Date().toLocaleDateString();
        let fileName =
            typeof options.fileName === "string"
                ? options.fileName
                : `${formattedDate}.log`;
        if (!fileName.endsWith(".log")) fileName += ".log";
        const filePath = createFilePath(path, fileName);
        if (filePath === null) return;
        if (!pathExists(path)) createDirectory(path);
        appendFile(`${formatLogMessage(options)}\n`, filePath);
    }
};

/**
 * Creates a log message in a specific format.
 *
 * @param options which are used to format the log message
 * @returns a fomatted log message
 */
const formatLogMessage = (options: Log): string => {
    const dateFormat =
        typeof options.dateFormat === "string"
            ? options.dateFormat
            : "dd.MM.yyyy ";
    const timeFormat =
        typeof options.timeFormat === "string"
            ? options.timeFormat
            : "HH:mm:ss";
    let dateTimeFormat = `${dateFormat}${timeFormat}`;
    if (
        timeFormat.length > 0 &&
        dateFormat.length > 0 &&
        !dateFormat.endsWith(" ")
    ) {
        dateTimeFormat = `${dateFormat} ${timeFormat}`;
    }
    let message = options.message;
    if (isApplicationError(options.message)) {
        message = `[${options.message.source}]: ${options.message.message}`;
    }
    return `${generateTimeStamp(dateTimeFormat)} {${options.level}} ${message}`;
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
        case LogLevel.None:
            return false;
        case LogLevel.Info:
            return level !== LogLevel.Debug;
        case LogLevel.Warn:
            return level !== LogLevel.Debug && level !== LogLevel.Info;
        case LogLevel.Error:
            return (
                level !== LogLevel.Debug &&
                level !== LogLevel.Info &&
                level !== LogLevel.Warn
            );
        default:
            return true;
    }
};
