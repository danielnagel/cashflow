import express from "express";
import cors from "cors";
import { loadConfigurationFile } from "../../configurator/loader";
import { LogLevel } from "../../types/enums";
import { log } from "../../utils/loggers";
import { round } from "../../utils/numbers";
import { isApplicationError } from "../../utils/typeguards";
import { loadCache } from "./utils";
import "dotenv/config";
import { setupEndpoints } from "./endpoints";

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

    const start = new Date().getTime();
    log({
        message: `pre loading reports and transactions...`,
        level: LogLevel.Info,
        allowedLogLevel: options.allowedLogLevel,
        type: options.logType,
    });
    const cache = await loadCache(args, options);
    if (isApplicationError(cache)) {
        log({
            message: cache,
            level: LogLevel.Error,
            allowedLogLevel: options.allowedLogLevel,
            type: options.logType,
        });
        return;
    }
    const time = round((new Date().getTime() - start) / 1000);
    log({
        message: `Done. Needed ${time} s.`,
        level: LogLevel.Info,
        allowedLogLevel: options.allowedLogLevel,
        type: options.logType,
    });

    setupEndpoints(app, cache);
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
