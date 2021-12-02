import { loadConfigurationFile } from "./configurator/loader";
import { generateReport } from "./interactor/interactor";
import { printReportAsTable } from "./viewer/console";

const main = async () => {
    const options = loadConfigurationFile(`data/config.json`);
    if (!options) {
        console.warn("Configuration file not found!");
        return;
    }

    try {
    const report = await generateReport(options.options);
    printReportAsTable(options, report);
    } catch(e) {
        if(e instanceof Error) {
            console.error(`Error: ${e.message}`);
        } else {
            console.error(e);
        }
    }

}

main();