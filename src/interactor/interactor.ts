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

export const generateReport = async (options: InteractorOptions): Promise<Report | ApplicationError> => {

    let transactions: Transaction[] = [];
    switch (options.connector.type) {
        case ConnectorType.CSV:
            transactions = await loadTransactionData(options.connector.options);
            break;
        case ConnectorType.API:
        default:
            return {source: "interactor.ts", message: `Unkown connector type "${options.connector.type}".`};
    }

    switch (options.report.type) {
        case ReportType.FixCosts:
            const report = generateCategorizedFixCosts(transactions, options.report.options)
            if(isApplicationError(report)) return report;
            return { type: "fixcost", report };
        default:
            return {source: "interactor.ts", message: `Unkown report type "${options.report.type}".`};
    }
};