/**
 * A transaction is the base object upon every report is generated.
 */
interface Transaction {
    initiator: string;
    purpose: string;
    value: number;
    date: Date;
}

/**
 * Extends a transaction by an id and a category object.
 */
interface ExtendedTransaction extends Transaction {
    id: number;
    category: Category;
}

/**
 * A matched record, which is used to create a transaction object.
 */
type MatchedRecord = {
    initiator?: string;
    purpose?: string;
    value?: string;
    date?: string;
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
    [key: string]: string;
    initiator: string;
    purpose: string;
    value: string;
    date: string;
};

/**
 * Options that are used for the csv connector implementation.
 */
type CsvOptions = {
    type: "csv";
    path: string;
    dataKeys: DataKeys;
    dateFormat?: string;
    backUpPath?: string;
    delimiter?: string;
    minDelimiterCount?: number;
    maxDelimiterCount?: number;
};

type UnknownTypeOption = {
    type: string;
};

/**
 * A sample is used to match specifc transactions
 */
type Sample = {
    initiator: string;
    purpose?: string | null;
};

/**
 * A fixed pay day occurs on a regular bases.
 * It has probably the same value every month,
 * can be paid in a specific month,
 * should be paid around the same time every month
 * and has transactions associated with it.
 */
type FixedPayDay = {
    value: number;
    isPaid: boolean;
    transactions: ExtendedTransaction[];
};

/**
 * A Category has a name, like a key, and one or multiple samlpes, like a value.
 */
type Category = {
    name: string;
    type: string;
    period?: string;
};

/**
 * Extends a category by samples.
 * Samples will be used to match transactions.
 */
interface SampledCategory extends Category {
    samples: Sample[];
}

/**
 * A FixedPayDay object, paired with its category name.
 */
type NamedFixedPayDay = {
    name: string;
    fixedPayDay: FixedPayDay;
};

/**
 * Multiple fix cost, categorized through the CategorizeOptions.
 */
type CategorizedFixedPayDays = {
    sum: number;
    unpaidSum: number;
    namedFixedPayDays: NamedFixedPayDay[];
};
/**
 * Discriminating union to determine if the given options are from type api.
 */
type ApiOptions = {
    type: "api";
};

/**
 * Discriminating union to determine if the given report is from type CategorizedFixedPayDays.
 */
interface ReportFixedPayDay extends CategorizedFixedPayDays {
    type: "fixedpayday";
}

/**
 * Discriminating union to determine if the given report is from type TrendReport.
 */
interface ReportTrend extends TrendReport {
    type: "trend";
}

/**
 * Discriminating union to determine if the given report is from type ReportTransactions.
 */
interface ReportTransactions {
    type: "transactions";
    transactions: ExtendedTransaction[];
}

/**
 * Possible reports, that the interactor could generate.
 */
type Report =
    | ReportFixedPayDay
    | ReportTrend
    | ReportTransactions
    | UnknownTypeOption;

/**
 * Possible configurations, that a user could create.
 *
 * allowedLogLevel: determines which logs should be logged,
 *                  "debug" allows all logs
 *                  and "none" does completly silent the logging,
 *                  default log level is "error"
 * logType:         The type of log system to use,
 *                  default is console
 * currency:        used in the reports, deffault is "€$"
 * dateFormat:      used to format dates for logs and in reports,
 *                  see https://date-fns.org/v1.30.1/docs/format,
 *                  default is "dd.MM.yyyy"
 * timeFormat:      used to format time for logs and in reports,
 *                  see https://date-fns.org/v1.30.1/docs/format,
 *                  default is "HH:mm:ss"
 * strict:          default is false,
 *                  uncategorized transaction are marked as "unmatched",
 *                  when true every transaction needs to be matched or
 *                  an error is printed
 * startDate:       user configuration on when to start a report,
 *                  otherwise "oldest" transaction is used
 * endDate:         user configuration on when to end a report,
 *                  today is used as default
 * source:          options for a data source, see CsvOptions for details
 * categories:      a list of categories to categorize every transaction
 *                  from source, can be used in combination with strict: true
 * storePath:       path to the store. the store holds every extended transaction,
 *                  default is "data/data.json"
 */
type Configuration = {
    allowedLogLevel?: string;
    logType?: string;
    currency?: string;
    dateFormat?: string;
    timeFormat?: string;
    strict?: boolean;
    startDate?: string;
    endDate?: string;
    source: CsvOptions | ApiOptions | UnknownTypeOption;
    categories: SampledCategory[];
    storePath?: string;
};

interface CsvConfiguration extends Configuration {
    source: CsvOptions;
}

/**
 * One row contains the information of one category from the categorized fix costs report.
 */
type FixedPayDayReportTableRow = {
    category: string;
    paid: boolean | null;
    cost: string;
    lastBookingDate: string | null;
    period: string | null;
};

/**
 * One row contains the name of a category, and its period key/value pair.
 * The period key has the following format "yyyy.MM"
 * The period value is always the cost with the currency.
 * When the trend report is only from type fixed or income,
 * value contains the cost with the currency and the last booking date.
 */
type TrendReportTableRow = {
    category: string;
    [key: string]: string | null;
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
type Log = {
    message: string | ApplicationError;
    level: string;
    dateFormat?: string;
    timeFormat?: string;
    allowedLogLevel?: string;
    type?: string;
    path?: string;
    fileName?: string;
};

type CategoryTrend = {
    name: string;
    periods: Array<FixedCategoryTrendPeriod | VariableCategoryTrendPeriod>;
};

type CategoryTrendPeriod = {
    period: string;
    transactions: ExtendedTransaction[];
};

interface FixedCategoryTrendPeriod extends CategoryTrendPeriod {
    value: number;
    bookingDate: string; // "03.01.2021"
}

interface VariableCategoryTrendPeriod extends CategoryTrendPeriod {
    sum: number;
}

type Trend = {
    type: string;
    categories: CategoryTrend[];
};

type TrendReport = {
    trendType?: string;
    trends: Array<Trend>;
};

type Arguments = {
    report: string | undefined;
    trendType: string | undefined;
    configurationPath: string;
    mode: string;
};

type ExtendedTransactionStore = {
    extendedTransactions: ExtendedTransaction[];
    size: number;
    latestEntry: number;
};

/**
 * Stores all the cached data for the backend endpoints.
 */
type BackendCache = {
    transactions: ApplicationError | ReportTransactions;
    fixedPayDay: ApplicationError | CategorizedFixedPayDays;
    allTrends: ApplicationError | TrendReportTableRow[];
    variableTrend: ApplicationError | TrendReportTableRow[];
    fixedTrend: ApplicationError | TrendReportTableRow[];
    incomeTrend: ApplicationError | TrendReportTableRow[];
    specialTrend: ApplicationError | TrendReportTableRow[];
};
