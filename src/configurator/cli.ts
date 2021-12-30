import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/**
 * Processes cli options.
 *
 * @returns An Arguments object
 */
export const processCliOptions = (): Arguments => {
    const argv = yargs(hideBin(process.argv))
        .options({
            r: {
                type: "string",
                default: undefined,
                alias: "report",
                description:
                    "Specifies which report should be executed. Possible options are 'trend' or 'fixedpayday'.",
            },
            t: {
                type: "string",
                default: undefined,
                alias: "trendType",
                description:
                    "Only works with report type 'trend'. Specifies trend type should be executed.\nPossible options are 'fixed', 'variable', 'income' or 'special'.\nOn default a less detailed trend of all types is executed.",
            },
            c: {
                type: "string",
                default: "data/config.json",
                alias: "configurationPath",
                description: "Path to configuration file.",
            },
        })
        .parseSync();

    return {
        report: argv.r,
        trendType: argv.t,
        configurationPath: argv.c,
    };
};
