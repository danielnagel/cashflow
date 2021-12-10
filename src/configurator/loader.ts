import { loadFile } from "../utils/files";
import { isConfiguration } from "../utils/typeguards";

export const loadConfigurationFile = (path: string): Configuration | ApplicationError => {
    const fileContent = loadFile(path);
    if (!fileContent) return {source: "loader.ts", message: `Configuration file "${path}", was not found.`};

    try {
        const javascriptObject = JSON.parse(fileContent);
        if (isConfiguration(javascriptObject)) {
            return javascriptObject;
        }
    } catch (e) {
        return {source: "loader.ts", message: `Configuration file "${path}", couldn't be parsed.`};
    }

    return {source: "loader.ts", message: `Configuration file "${path}", has the wrong format.`};
}