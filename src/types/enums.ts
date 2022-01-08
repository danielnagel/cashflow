/**
 * Specifies which ConnectorTypes exist.
 */
export enum ConnectorType {
    CSV = "csv",
    API = "api",
}

/**
 * Specifies which ReportTypes exist.
 */
export enum ReportType {
    FixedPayDay = "fixedpayday",
    Trend = "trend",
}

/**
 * Specifies which category types exist.
 */
export enum TransactionType {
    Fixed = "fixed",
    Variable = "variable",
    Income = "income",
    Special = "special",
}

/**
 * Specifies which periods exist.
 */
export enum Periods {
    Monthly = "monthly",
    Quarter = "quarter",
    Yearly = "yearly",
}

export enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error",
    None = "none",
}

export enum LogType {
    Console = "console",
    File = "file",
}
