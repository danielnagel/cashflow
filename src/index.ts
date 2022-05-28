import { processCliOptions } from "./configurator/cli";
import cli from "./app/cli";
import { LogLevel, OperatingMode } from "./types/enums";
import { log } from "./utils/loggers";

const args = processCliOptions();

switch (args.mode) {
    case OperatingMode.Cli:
        cli(args);
        break;
    case OperatingMode.Server:
    default:
        log({
            level: LogLevel.Error,
            message: `Unknown operating mode "${args.mode}".`,
        });
}
