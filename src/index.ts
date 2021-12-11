import { loadConfigurationFile } from "./configurator/loader";
import { generateReport } from "./interactor/interactor";
import { logToConsole } from "./utils/logger";
import { isApplicationError } from "./utils/typeguards";
import { generateReportAsTable } from "./viewer/console";

const main = async () => {
    const options = loadConfigurationFile(`data/config.json`);
    if (isApplicationError(options)) {
        logToConsole({ message: options, level: "error" });
        return;
    }

    const report = await generateReport(options);
    if (isApplicationError(report)) {
        logToConsole({
            message: report,
            level: "error",
            allowedLogLevel: options.logger?.allowedLogLevel,
            dateTimeFormat: options.logger?.dateTimeFormat,
        });
        return;
    }

    const result = generateReportAsTable(options, report);
    if (isApplicationError(result)) {
        logToConsole({
            message: result,
            level: "error",
            allowedLogLevel: options.logger?.allowedLogLevel,
            dateTimeFormat: options.logger?.dateTimeFormat,
        });
        return;
    }

    console.table(result);
};

main();
