import { loadTransactionData } from "src/connector/csvConnector";
import { generateCategorizedFixCosts } from "src/interactor/fixCostsReport";

const enum ConnectorType {
    CSV = "csv",
    API = "api"
}

const enum ReportType {
    FixCosts = "fixcosts"
}

export const generateReport = async (options: InteractorOptions): Promise<Report> => {

    let transactions: Transaction[] = [];
    switch (options.connector.type) {
        case ConnectorType.CSV:
            transactions = await loadTransactionData(options.connector.options);
            break;
        case ConnectorType.API:
        default:
            return null;
    }

    let result: Report = null;
    switch (options.report.type) {
        case ReportType.FixCosts:
            result = generateCategorizedFixCosts(transactions, options.report.options);
            break;
        default:
            return null;
    }

    return result;
};