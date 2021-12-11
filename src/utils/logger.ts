import { formatDate } from "./dates";
import { isApplicationError } from "./typeguards";

export const logToConsole = (options: LogOptions): void => {
    if (isLogLevelAllowed(options.level, options.allowedLogLevel))
        console.log(
            generateLogMessage(
                options.message,
                options.level,
                options.dateTimeFormat,
            ),
        );
};

const generateLogMessage = (
    message: string | ApplicationError,
    level = "error",
    dateTimeFormat = "dd.MM.yyyy HH:mm:ss",
): string => {
    if (isApplicationError(message)) {
        message = `[${message.source}]: ${message.message}`;
    }
    return `${generateTimeStamp(dateTimeFormat)} {${level}} ${message}`;
};

const generateTimeStamp = (dateTimeFormat = "dd.MM.yyyy HH:mm:ss"): string => {
    let dateTime = formatDate(new Date(), dateTimeFormat);
    if (!dateTime) dateTime = new Date().toLocaleDateString();
    return dateTime;
};

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
