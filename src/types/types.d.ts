/**
 * A transaction is the base object upon every report is generated.
 */
type Transaction = {
    initiator: string;
    purpose: string;
    value: number;
    day: number;
    month: number;
    year: number;
};

/**
 * A matched record, which is used to create a transaction object.
 */
type MatchedRecord = {
    initiator: string;
    purpose: string;
    value: string;
    date: string;
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
    initiator: string;
    purpose: string;
    value: string;
    date: string;
};

/**
 * Options that are used for the csv connector implementation.
 */
type CsvOptions = {
    path: string | string[];
    dataKeys: DataKeys;
    columns: string[];
    dateFormat: string;
};

/**
 * Options on which a list of transactions can be filtered.
 * Samples must be a list of transaction initiators.
 * The list can be filtered to only return transactions after or before a specific date.
 * The date is parsed by configuration, otherwise ISO date format is expected.
 */
type TransactionFilterOptions = {
    samples: Sample[];
    after?: string;
    before?: string;
    dateFormat?: string;
};

/**
 * A sample is used to match specifc transactions
 */
type Sample = {
    initiator: string;
    purpose?: string;
};

/**
 * A fix cost is paid every month.
 * It has probably the same value every month,
 * can be paid in a specific month,
 * should be paid around the same time every month
 * and has transactions associated with it.
 */
type FixCost = {
    value: number;
    isPaidThisMonth: boolean;
    averageBookingDay: number;
    lastBookingDays: number[];
    transactions: Transaction[];
};

/**
 * A Category has a name, like a key, and one or multiple samlpes, like a value.
 */
type Category = {
    name: string;
    samples: Sample[];
};

/**
 * Options on which multiple FixCost objects are ordered by categories.
 */
type CategorizeOptions = {
    categories: Category[];
    before?: string;
    after?: string;
};

/**
 * A FixCost object, paired with its name from the Category of the CategorizeOptions.
 */
type NamedFixCost = {
    name: string;
    fixCost: FixCost;
};

/**
 * Multiple fix cost, categorized through the CategorizeOptions.
 */
type CategorizedFixCosts = {
    date: string;
    sum: number;
    unpaidSum: number;
    fixCosts: NamedFixCost[];
};

/**
 * Discriminating union to determine if the given options are from type CategorizeOptions.
 */
type FixCostsReportOptions = {
    type: "fixcosts";
    options: CategorizeOptions;
};

/**
 * Report options for interactor, to interact with the correct report implementation.
 */
type ReportOptions = FixCostsReportOptions;

/**
 * Discriminating union to determine if the given options are from type CsvOptions.
 */
type CsvConnectorOptions = {
    type: "csv";
    options: CsvOptions;
};

/**
 * Discriminating union to determine if the given options are from type api.
 */
type ApiConnectorOptions = {
    type: "api";
    options: UnknownRecord;
};

/**
 * Connector options for interactor, to interact with the correct connector implementation.
 */
type ConnectorOptions = CsvConnectorOptions | ApiConnectorOptions;

/**
 * Options for the interactor, to use the correct connector and report implementation.
 * Should load data from connector and generate a report on that given data.
 */
type InteractorOptions = {
    connector: ConnectorOptions;
    report: ReportOptions;
};

/**
 * Discriminating union to determine if the given report is from type CategorizedFixCosts.
 */
type FixCostsReport = {
    type: "fixcost";
    report: CategorizedFixCosts | null;
};

/**
 * Possible reports, that the interactor could generate.
 */
type Report = FixCostsReport;

/**
 * Possible configurations, that a user could create.
 */
type Configuration = {
    interactor: InteractorOptions;
    viewer?: ConsoleViewerOptions;
    logger?: LoggerOptions;
};

/**
 * One row contains the information of one category from the categorized fix costs report.
 */
type FixCostsReportTableRow = {
    category: string;
    paid: boolean | null;
    bookingDay: number | null;
    cost: string;
    lastBookingDate: string | null;
};

/**
 * Has usefull information, about why something failed.
 * Source is the file where the error occured from.
 */
type ApplicationError = {
    source: string;
    message: string;
};

/**
 * Options for a log message.
 */
type LogOptions = {
    message: string | ApplicationError;
    level?: "debug" | "info" | "warn" | "error";
    dateTimeFormat?: string;
    allowedLogLevel?: "debug" | "info" | "warn" | "error" | "none";
};

/**
 * Options for the logger utility.
 * DateFormat is used to format dates in the results, see https://date-fns.org/v1.30.1/docs/format on which formats are available
 * The allowed log level determines which logs should be logged, debug is all and the level can be shrinked to none
 */
type LoggerOptions = {
    dateTimeFormat?: string;
    allowedLogLevel?: "debug" | "info" | "warn" | "error" | "none";
};

/**
 * Options for the console viewer.
 * Currency is the symbol, that should be displayed behind values.
 * DateFormat is used to format dates in the results, see https://date-fns.org/v1.30.1/docs/format on which formats are available
 */
type ConsoleViewerOptions = {
    currency?: string;
    dateFormat?: string;
};
