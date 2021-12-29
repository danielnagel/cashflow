import { loadConfigurationFile } from "./configurator/loader";
import { generateReport } from "./interactor/interactor";
import { log } from "./utils/loggers";
import { isApplicationError } from "./utils/typeguards";
import { generateReportAsTable } from "./interactor/mutator/tabularize";

const main = async () => {
    const options = loadConfigurationFile(`data/config.json`);
    if (isApplicationError(options)) {
        log({ message: options, level: "error" });
        return;
    }

    const report = await generateReport(options);
    if (isApplicationError(report)) {
        log({
            message: report,
            level: "error",
            allowedLogLevel: options.allowedLogLevel,
            dateFormat: options.dateFormat,
            timeFormat: options.timeFormat,
        });
        return;
    }

    const result = generateReportAsTable(report, options);
    if (isApplicationError(result)) {
        log({
            message: result,
            level: "error",
            allowedLogLevel: options.allowedLogLevel,
            dateFormat: options.dateFormat,
            timeFormat: options.timeFormat,
        });
        return;
    }

    console.table(result);
};

main();
