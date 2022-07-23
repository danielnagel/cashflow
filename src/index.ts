import { processCliOptions } from "./configurator/cli";
import { LogLevel, OperatingMode } from "./types/enums";
import { log } from "./utils/loggers";
import cli from "./app/cli";
import server from "./app/backend";

const args = processCliOptions();

switch (args.mode) {
    case OperatingMode.Cli:
        cli(args);
        break;
    case OperatingMode.Server:
        server(args);
        break;
    default:
        log({
            level: LogLevel.Error,
            message: `Unknown operating mode "${args.mode}".`,
        });
}
