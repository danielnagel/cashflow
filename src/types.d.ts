interface Connector {
    loadTransactions(path: string): Transaction[];
    // loadReport(): Report;
    saveTransactions(transactions: Transaction[]): boolean
    // saveReport(report: Report): boolean;
}

interface Interactor {
    generateCategorizedTransactions(transactions: Transaction[]): CategorizedTransactions[];
    categorizeTransactions(transactions: Transaction[], category: string, samples: string[]): CategorizedTransactions;
    generateFixCostsReport(transactions: Transaction[], sinceDate?: number): FixCostsReport;
    generateFixCost(transactions: Transaction[], samples: string[], toDate: number, sinceDate?: number): FixCost | null;
    findTransactionsThatMatchSamples(samples: string[], sinceDate?: number): Transaction[];
    generateTrendReport(sinceDate?: number): TrendReport;
    generateTrend(type: TransactionType, sinceDate?: number): Trend;
}

interface DataKeys {
    initiator: string;
    purpose: string;
    value: string;
    date: string;
}

interface Transaction {
    initiator: string;
    purpose: string;
    value: number;
    day: number;
    month: number;
    year: number;
}

interface TransactionPeriod {
    month: number;
    year: number;
    sum: number;
    transactions: Transaction[];
}

interface CategorizedTransactions extends TypedTransactionPeriod {
    name: string;
    sum: number;
}

declare enum TransactionType {
    Income, Fixed, Variable, Special
}

interface FixCost {
    value: number;
    isPaidThisMonth: boolean;
    averageBookingDay: number;
    lastBookingDays: number[];
    transactions: Transaction[];
}

interface CategorizedFixCost {
    name: string;
    fixCost: FixCost;
}

interface FixCostsReport {
    date: number;
    fixCosts: CategorizedFixCost[];
    sum: number;
    sumWithoutPaid: number;
}

interface TypedTransactionPeriod {
    type: TransactionType;
    periods: TransactionPeriod[];
}

type UnknownRecord = {[key:string]: string | undefined};