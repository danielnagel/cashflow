import { loadConfigurationFile } from "../../configurator/loader";
import { generateReport } from "../../interactor/interactor";
import { log } from "../../utils/loggers";
import { isApplicationError } from "../../utils/typeguards";
import { generateReportAsTable } from "../../interactor/mutator/tabularize";
import {
    exampleConfiguration,
    saveConfigurationFile,
} from "../../configurator/saver";
import { processCliOptions } from "../../configurator/cli";
import { LogLevel } from "../../types/enums";

export default async () => {
    const args = processCliOptions();
    const options = loadConfigurationFile(args.configurationPath);
    if (isApplicationError(options)) {
        log({ message: options, level: LogLevel.Error });
        saveConfigurationFile(exampleConfiguration, "data");
        log({
            message: {
                source: "index.ts",
                message: `Created new configuration file "${
                    __dirname + "/data/config.json"
                }".`,
            },
            level: LogLevel.Info,
        });
        return;
    }

    log({
        message: "--- Started cashflow. ---",
        level: LogLevel.Info,
        allowedLogLevel: options.allowedLogLevel,
        type: options.logType,
    });

    if (typeof args.report === "undefined") {
        log({
            message: {
                source: "index.ts",
                message: `Report is undefined, use -r <report> option as cli parameter.`,
            },
            level: LogLevel.Error,
            allowedLogLevel: options.allowedLogLevel,
            type: options.logType,
        });
        return;
    }

    const report = await generateReport(options, args);
    if (isApplicationError(report)) {
        log({
            message: report,
            level: LogLevel.Error,
            allowedLogLevel: options.allowedLogLevel,
            dateFormat: options.dateFormat,
            timeFormat: options.timeFormat,
            type: options.logType,
        });
        return;
    }

    const result = generateReportAsTable(report, options);
    if (isApplicationError(result)) {
        log({
            message: result,
            level: LogLevel.Error,
            allowedLogLevel: options.allowedLogLevel,
            dateFormat: options.dateFormat,
            timeFormat: options.timeFormat,
            type: options.logType,
        });
        return;
    }

    console.table(result);
};
