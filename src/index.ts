import { loadConfigurationFile } from "./configurator/loader";
import { generateReport } from "./interactor/interactor";
import { isApplicationError } from "./utils/typeguards";
import { generateReportAsTable } from "./viewer/console";

const main = async () => {
    const options = loadConfigurationFile(`data/config.json`);
    if (isApplicationError(options)) {
        console.error(`[${options.source}]: ${options.message}`);
        return;
    }

    const report = await generateReport(options.options);
    if (isApplicationError(report)) {
        console.error(`[${report.source}]: ${report.message}`);
        return;
    }

    const result = generateReportAsTable(options, report);
    if(isApplicationError(result)) {
        console.error(`[${result.source}]: ${result.message}`);
        return;
    }

    console.table(result);
}

main();