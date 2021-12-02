import { loadFile } from "../utils/files";
import { isConfiguration } from "../utils/typeguards";

export const loadConfigurationFile = (path: string): Configuration | null => {
    const fileContent = loadFile(path);
    if (!fileContent) return null;

    try {
        const javascriptObject = JSON.parse(fileContent);
        if (isConfiguration(javascriptObject)) {
            return javascriptObject;
        }
    } catch (e) {
        return null;
    }


    return null;
}