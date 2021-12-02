/**
 * A transaction is the base object upon every report is generated.
 */
type Transaction = {
    initiator: string,
    purpose: string,
    value: number,
    day: number,
    month: number,
    year: number
};

/**
 * An unkown object, with unkown keys.
 * The values are either from type string or undefined.
 */
type UnknownRecord = { [key: string]: string | undefined };

/**
 * DataKeys are used to map the keys in an unknown object to the keys in an transaction object.
 */
type DataKeys = {
    initiator: string,
    purpose: string,
    value: string,
    date: string
};

/**
 * Options that are used for the csv connector implementation.
 */
type CsvOptions = {
    path: string, dataKeys: DataKeys, columns: string[]
}

/**
 * Options on which a list of transactions can be filtered.
 * Samples must be a list of transaction initiators.
 * The list can be filtered to only return transactions after a specific timestamp.
 * The list can be filtered to only return transactions before a specific timestamp.
 */
type TransactionFilterOptions = {
    samples: string[],
    after?: number,
    before?: number
};

/**
 * A fix cost is paid every month.
 * It has probably the same value every month,
 * can be paid in a specific month,
 * should be paid around the same time every month
 * and has transactions associated with it.
 */
type FixCost = {
    value: number,
    isPaidThisMonth: boolean,
    averageBookingDay: number,
    lastBookingDays: number[],
    transactions: Transaction[]
};

/**
 * A Category has a name, like a key, and one or multiple samlpes, like a value.
 */
type Category = {
    name: string;
    samples: string[];
}

/**
 * Options on which multiple FixCost objects are ordered by categories.
 */
type CategorizeOptions = {
    categories: Category[]
    before?: number,
    after?: number
}

/**
 * A FixCost object, paired with its name from the Category of the CategorizeOptions.
 */
type NamedFixCost = {
    name: string;
    fixCost: FixCost;
}

/**
 * Multiple fix cost, categorized through the CategorizeOptions.
 */
type CategorizedFixCosts = {
    date: number,
    sum: number,
    unpaidSum: number,
    fixCosts: NamedFixCost[]
};

/**
 * Discriminating union to determine if the given options are from type CategorizeOptions.
 */
type FixCostsReportOptions = {
    type: "fixcosts", options: CategorizeOptions
}

/**
 * Report options for interactor, to interact with the correct report implementation.
 */
type ReportOptions = FixCostsReportOptions

/**
 * Discriminating union to determine if the given options are from type CsvOptions.
 */
type CsvConnectorOptions = {
    type: "csv", options: CsvOptions
}

/**
 * Discriminating union to determine if the given options are from type api.
 */
type ApiConnectorOptions = {
    type: "api", options: UnknownRecord
}

/**
 * Connector options for interactor, to interact with the correct connector implementation.
 */
type ConnectorOptions = CsvConnectorOptions | ApiConnectorOptions

/**
 * Options for the interactor, to use the correct connector and report implementation.
 * Should load data from connector and generate a report on that given data.
 */
type InteractorOptions = {
    connector: ConnectorOptions, report: ReportOptions
}

/**
 * Discriminating union to determine if the given report is from type CategorizedFixCosts.
 */
type FixCostsReport = {
    type: "fixcost",
    report: CategorizedFixCosts | null
};

/**
 * Possible reports, that the interactor could generate.
 */
type Report = FixCostsReport | null;

/**
 * Possible configurations, that a user could create.
 * Currency is the symbol, that should be displayed behind values.
 * Locale is used to format dates in that locale, see https://datatracker.ietf.org/doc/html/rfc5646
 */
type Configuration = {
    currency: string;
    locale: string;
    options: InteractorOptions;
}