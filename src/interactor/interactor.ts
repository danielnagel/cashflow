import { loadTransactionData } from "../connector/csv";
import { isApplicationError } from "../utils/typeguards";
import { generateCategorizedFixCosts } from "./reports/fixCosts";

const enum ConnectorType {
    CSV = "csv",
    API = "api"
}

const enum ReportType {
    FixCosts = "fixcosts"
}

export const generateReport = async (options: Configuration): Promise<Report | ApplicationError> => {

    let transactions: Transaction[] | ApplicationError = [];
    switch (options.interactor.connector.type) {
        case ConnectorType.CSV:
            transactions = await loadTransactionData(options.interactor.connector.options, options.logger);
            if(isApplicationError(transactions)) return transactions;
            break;
        case ConnectorType.API:
        default:
            return {source: "interactor.ts", message: `Unkown connector type "${options.interactor.connector.type}".`};
    }

    switch (options.interactor.report.type) {
        case ReportType.FixCosts:
            const report = generateCategorizedFixCosts(transactions, options.interactor.report.options, options.logger)
            if(isApplicationError(report)) return report;
            return { type: "fixcost", report };
        default:
            return {source: "interactor.ts", message: `Unkown report type "${options.interactor.report.type}".`};
    }
};