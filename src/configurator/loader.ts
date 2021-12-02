import { loadFile } from "../utils/files";
import { isInteractorOptions } from "../utils/typeguards";

export const loadConfigurationFile = (path: string): Configuration | null => {
    const fileContent = loadFile(path);
    if (!fileContent) return null;

    try {
        const javascriptObject = JSON.parse(fileContent);
        if (isInteractorOptions(javascriptObject)) {
            return javascriptObject;
        }
    } catch (e) {
        return null;
    }


    return null;
}