export const isInteractorOptions = (object: unknown): object is InteractorOptions => {
    if (!object) return false;
    return ((object as InteractorOptions).connector !== undefined && isConnectorOptions((object as InteractorOptions).connector))
        && ((object as InteractorOptions).report !== undefined && isReportOptions((object as InteractorOptions).report));
}

export const isConnectorOptions = (object: unknown): object is ConnectorOptions => {
    if (!object) return false;
    return (object as ConnectorOptions).type !== undefined && ((object as ConnectorOptions).options !== undefined && isCsvOptions((object as ConnectorOptions).options));
}

export const isReportOptions = (object: unknown): object is ReportOptions => {
    if (!object) return false;
    return (object as ReportOptions).type !== undefined && ((object as ConnectorOptions).options !== undefined && isCategorizeOptions((object as ConnectorOptions).options));
}

export const isCsvOptions = (object: unknown): object is CsvOptions => {
    if (!object) return false;
    return (object as CsvOptions).path !== undefined && ((object as CsvOptions).dataKeys !== undefined && isDataKeys((object as CsvOptions).dataKeys)) && (object as CsvOptions).columns !== undefined;
}

export const isDataKeys = (object: unknown): object is DataKeys => {
    if (!object) return false;
    return (object as DataKeys).date !== undefined && (object as DataKeys).initiator !== undefined && (object as DataKeys).purpose !== undefined && (object as DataKeys).value !== undefined;
}

export const isCategorizeOptions = (object: unknown): object is CategorizeOptions => {
    if (!object) return false;
    return (object as CategorizeOptions).categories !== undefined;
}

export const isCategory = (object: unknown): object is Category => {
    if (!object) return false;
    return (object as Category).name !== undefined && (object as Category).samples !== undefined;
}

export const isConfiguration = (object: unknown): object is Configuration => {
    if (!object) return false;
    return ((object as Configuration).options !== undefined && isInteractorOptions((object as Configuration).options))
        && (object as Configuration).currency !== undefined;
}