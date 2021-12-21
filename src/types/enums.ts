/**
 * Specifies which ConnectorTypes exist.
 */
export const enum ConnectorType {
    CSV = "csv",
    API = "api",
}

/**
 * Specifies which ReportTypes exist.
 */
export const enum ReportType {
    FixedPayDay = "fixedpayday",
}

/**
 * Specifies which category types exist.
 */
export const enum CategoryType {
    Fixed = "fixed",
    Variable = "variable",
    Income = "income",
    Special = "special",
}

/**
 * Specifies which category periods exist.
 */
export const enum CategoryPeriods {
    Monthly = "monthly",
    Quarter = "quarter",
    Yearly = "yearly",
}
