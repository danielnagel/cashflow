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
