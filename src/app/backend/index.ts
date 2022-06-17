import express, { Request, Response } from "express";
import cors from "cors";
import { loadConfigurationFile } from "../../configurator/loader";
import { LogLevel, TransactionType } from "../../types/enums";
import { log } from "../../utils/loggers";
import { isApplicationError } from "../../utils/typeguards";
import { getFixedPayDay } from "./endpoints/fixedPayDay";
import { getAllTransactions } from "./endpoints/transactions";
import { getTrend } from "./endpoints/trend";
const app = express();
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://172.31.32.116:3000",
            "http://192.168.178.73:3000",
        ],
    }),
);
const port = 8080; // default port to listen

export default (args: Arguments) => {
    const options = loadConfigurationFile(args.configurationPath);
    if (isApplicationError(options)) {
        log({ message: options, level: LogLevel.Error });
        return;
    }

    // register endpoints and handlers
    app.get("/transactions", async (_: Request, res: Response) =>
        res.status(200).json(await getAllTransactions(options)),
    );
    app.get("/fixedpayday", async (_: Request, res: Response) =>
        res.status(200).json(await getFixedPayDay(options)),
    );
    app.get("/trend", async (_: Request, res: Response) => {
        args.trendType = undefined;
        res.status(200).json(await getTrend(options, args));
    });
    app.get("/trend/variable", async (_: Request, res: Response) => {
        args.trendType = TransactionType.Variable;
        res.status(200).json(await getTrend(options, args));
    });
    app.get("/trend/fixed", async (_: Request, res: Response) => {
        args.trendType = TransactionType.Fixed;
        res.status(200).json(await getTrend(options, args));
    });
    app.get("/trend/income", async (_: Request, res: Response) => {
        args.trendType = TransactionType.Income;
        res.status(200).json(await getTrend(options, args));
    });
    app.get("/trend/special", async (_: Request, res: Response) => {
        args.trendType = TransactionType.Special;
        res.status(200).json(await getTrend(options, args));
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
