import express, { Request, Response } from "express";
import cors from "cors";
import { loadConfigurationFile } from "../../configurator/loader";
import { LogLevel, TransactionType } from "../../types/enums";
import { log } from "../../utils/loggers";
import { isApplicationError } from "../../utils/typeguards";
import { getFixedPayDay } from "./endpoints/fixedPayDay";
import { getAllTransactions } from "./endpoints/transactions";
import { getTrendReportTable } from "./endpoints/trend";
import { round } from "../../utils/numbers";
import "dotenv/config";

const app = express();

const origin = process.env.ALLOWED_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:4173",
];
app.use(cors({ origin }));

const port = process.env.BACKEND_PORT || 8080; // default port to listen

export default async (args: Arguments) => {
    const options = loadConfigurationFile(args.configurationPath);
    if (isApplicationError(options)) {
        log({ message: options, level: LogLevel.Error });
        return;
    }

    // cache data
    const start = new Date().getTime();
    log({
        message: `pre loading reports and transactions...`,
        level: LogLevel.Info,
        allowedLogLevel: options.allowedLogLevel,
        type: options.logType,
    });
    const transactions = await getAllTransactions(options);
    const fixedPayDay = await getFixedPayDay(options);
    const allTrends = await getTrendReportTable(options, {
        ...args,
        trendType: undefined,
    });
    const variableTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Variable,
    });
    const fixedTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Fixed,
    });
    const incomeTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Income,
    });
    const specialTrend = await getTrendReportTable(options, {
        ...args,
        trendType: TransactionType.Special,
    });
    const time = round((new Date().getTime() - start) / 1000);
    log({
        message: `Done. Needed ${time} s.`,
        level: LogLevel.Info,
        allowedLogLevel: options.allowedLogLevel,
        type: options.logType,
    });

    // register endpoints and handlers
    app.get("/transactions", (_: Request, res: Response) =>
        res.status(200).json(transactions),
    );
    app.get("/fixedpayday", (_: Request, res: Response) =>
        res.status(200).json(fixedPayDay),
    );
    app.get("/trend", (_: Request, res: Response) => {
        res.status(200).json(allTrends);
    });
    app.get("/trend/variable", (_: Request, res: Response) => {
        res.status(200).json(variableTrend);
    });
    app.get("/trend/fixed", (_: Request, res: Response) => {
        res.status(200).json(fixedTrend);
    });
    app.get("/trend/income", (_: Request, res: Response) => {
        res.status(200).json(incomeTrend);
    });
    app.get("/trend/special", (_: Request, res: Response) => {
        res.status(200).json(specialTrend);
    });

    // start the Express server
    app.listen(port, () => {
        log({
            message: `server started at http://localhost:${port}`,
            level: LogLevel.Info,
            allowedLogLevel: options.allowedLogLevel,
            type: options.logType,
        });
    });
};
