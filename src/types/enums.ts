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
}

/**
 * Specifies which category types exist.
 */
export enum CategoryType {
    Fixed = "fixed",
    Variable = "variable",
    Income = "income",
    Special = "special",
}

/**
 * Specifies which category periods exist.
 */
export enum CategoryPeriods {
    Monthly = "monthly",
    Quarter = "quarter",
    Yearly = "yearly",
}
