import { generateReport } from "../../interactor/interactor";
import { isApplicationError } from "../../utils/typeguards";
import { ReportType } from "../../types/enums";
import { generateReportAsTable } from "../../interactor/mutator/tabularize";
import { Application } from "express";

export const getFixedPayDay = async (
    options: Configuration,
    args: Arguments,
): Promise<CategorizedFixedPayDays | ApplicationError> => {
    args.report = ReportType.FixedPayDay;
    const report = await generateReport(options, args);
    if (isApplicationError(report)) {
        return report;
    }
    return report as CategorizedFixedPayDays;
};

export const getAllTransactions = async (
    options: Configuration,
    args: Arguments,
): Promise<ReportTransactions | ApplicationError> => {
    args.report = ReportType.Transactions;
    const report = await generateReport(options, args);
    if (isApplicationError(report)) {
        return report;
    }
    return report as ReportTransactions;
};

export const getTrendReportTable = async (
    options: Configuration,
    args: Arguments,
): Promise<ApplicationError | TrendReportTableRow[]> => {
    args.report = ReportType.Trend;
    const trendReport = await generateReport(options, args);
    if (isApplicationError(trendReport)) {
        return trendReport;
    }

    const table = generateReportAsTable(trendReport, options);
    if (isApplicationError(table)) {
        return table;
    }
    return table as TrendReportTableRow[];
};

export const setupEndpoints = (app: Application, cache: BackendCache) => {
    // register endpoints and handlers
    app.get("/transactions", (_, res) =>
        res.status(200).json(cache.transactions),
    );
    app.get("/fixedpayday", (_, res) =>
        res.status(200).json(cache.fixedPayDay),
    );
    app.get("/trend", (_, res) => {
        res.status(200).json(cache.allTrends);
    });
    app.get("/trend/variable", (_, res) => {
        res.status(200).json(cache.variableTrend);
    });
    app.get("/trend/fixed", (_, res) => {
        res.status(200).json(cache.fixedTrend);
    });
    app.get("/trend/income", (_, res) => {
        res.status(200).json(cache.incomeTrend);
    });
    app.get("/trend/special", (_, res) => {
        res.status(200).json(cache.specialTrend);
    });
};
