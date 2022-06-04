import express, { Request, Response } from "express";
import { loadConfigurationFile } from "../../configurator/loader";
import { LogLevel } from "../../types/enums";
import { log } from "../../utils/loggers";
import { isApplicationError } from "../../utils/typeguards";
import { getAllTransactions } from "./endpoints/transactions";
const app = express();
const port = 8080; // default port to listen

export default (args: Arguments) => {
    const options = loadConfigurationFile(args.configurationPath);
    if (isApplicationError(options)) {
        log({ message: options, level: LogLevel.Error });
        return;
    }

    // register endpoints and handlers
    app.get("/transactions", async (_, res) =>
        res.status(200).json(await getAllTransactions(options)),
    );

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
