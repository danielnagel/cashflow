import { loadFile } from "../utils/files";
import { isConfiguration } from "../utils/typeguards";

/**
 * Loads a configuration file from a path.
 * The configuration file needs to satisfy the typeguard for
 * the Configuration { @see Configuration } object.
 * If the file wasn't found,
 * the content couldn't be parse or its content isn't a Configuration object,
 * an ApplicationError object is returned.
 *
 * @param path to the configuration file
 * @returns ConfigurationObject when successful or an ApplicationError
 */
export const loadConfigurationFile = (
    path: string,
): Configuration | ApplicationError => {
    const fileContent = loadFile(path);
    if (!fileContent)
        return {
            source: "loader.ts",
            message: `Configuration file "${path}", was not found.`,
        };

    try {
        const javascriptObject = JSON.parse(fileContent);
        if (isConfiguration(javascriptObject)) {
            return javascriptObject;
        }
    } catch (e) {
        return {
            source: "loader.ts",
            message: `Configuration file "${path}", couldn't be parsed.`,
        };
    }

    return {
        source: "loader.ts",
        message: `Configuration file "${path}", has the wrong format.`,
    };
};
