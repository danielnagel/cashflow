export const isCsvOptions = (object: unknown): object is CsvOptions => {
    if (!object) return false;
    return (
        (object as CsvOptions).type === "csv" &&
        (object as CsvOptions).path !== undefined &&
        (object as CsvOptions).dataKeys !== undefined &&
        isDataKeys((object as CsvOptions).dataKeys) &&
        (object as CsvOptions).columns !== undefined
    );
};

export const isDataKeys = (object: unknown): object is DataKeys => {
    if (!object) return false;
    return (
        (object as DataKeys).date !== undefined &&
        (object as DataKeys).initiator !== undefined &&
        (object as DataKeys).purpose !== undefined &&
        (object as DataKeys).value !== undefined
    );
};

export const isCategory = (object: unknown): object is Category => {
    if (!object) return false;
    return (
        (object as Category).name !== undefined &&
        (object as Category).type !== undefined
    );
};

export const isSampledCategory = (
    object: unknown,
): object is SampledCategory => {
    if (!object) return false;
    return (
        (object as SampledCategory).name !== undefined &&
        (object as SampledCategory).type !== undefined &&
        (object as SampledCategory).samples !== undefined
    );
};

export const isConfiguration = (object: unknown): object is Configuration => {
    if (!object) return false;
    return (
        (object as Configuration).source !== undefined &&
        isCsvOptions((object as Configuration).source) &&
        (object as Configuration).categories !== undefined
    );
};

export const isApplicationError = (
    object: unknown,
): object is ApplicationError => {
    if (!object) return false;
    return (
        (object as ApplicationError).source !== undefined &&
        (object as ApplicationError).message !== undefined
    );
};

export const isFixedCategoryTrendPeriod = (
    object: unknown,
): object is FixedCategoryTrendPeriod => {
    if (!object) return false;
    return (
        (object as FixedCategoryTrendPeriod).period !== undefined &&
        (object as FixedCategoryTrendPeriod).transactions !== undefined &&
        (object as FixedCategoryTrendPeriod).value !== undefined &&
        (object as FixedCategoryTrendPeriod).bookingDate !== undefined
    );
};

export const isVariableCategoryTrendPeriod = (
    object: unknown,
): object is VariableCategoryTrendPeriod => {
    if (!object) return false;
    return (
        (object as VariableCategoryTrendPeriod).period !== undefined &&
        (object as VariableCategoryTrendPeriod).transactions !== undefined &&
        (object as VariableCategoryTrendPeriod).sum !== undefined
    );
};

export const isReportFixedPayDay = (
    object: unknown,
): object is ReportFixedPayDay => {
    if (!object) return false;
    return (
        (object as ReportFixedPayDay).type === "fixedpayday" &&
        (object as ReportFixedPayDay).date !== undefined &&
        (object as ReportFixedPayDay).sum !== undefined &&
        (object as ReportFixedPayDay).unpaidSum !== undefined &&
        (object as ReportFixedPayDay).namedFixedPayDays !== undefined
    );
};

export const isReportTrend = (object: unknown): object is ReportTrend => {
    if (!object) return false;
    return (
        (object as ReportTrend).type === "trend" &&
        (object as ReportTrend).trends !== undefined
    );
};
