import { existsSync, readFileSync, readdirSync, statSync } from "fs"

export const fileExists = (path: string): boolean => {
    return existsSync(path);
}

export const loadFile = (path: string): string | null => {
    if (!fileExists(path)) return null;
    return readFileSync(path).toString();
}

export const loadFileNamesFromDirectory = (path: string, extension?: string): string[] => {
    const fileNames: string[] = [];
    if (fileExists(path)) {
        const fileMetaDatas = readdirSync(path, { withFileTypes: true });
        for (const fileMetaData of fileMetaDatas) {
            if (!fileMetaData.isFile()) continue;
            if(typeof extension !== "undefined") {
                if(fileMetaData.name.endsWith(extension)) fileNames.push(fileMetaData.name);
                continue;
            }
            fileNames.push(fileMetaData.name);
        }
    }
    return fileNames;
}

export const isFile = (path: string): boolean => {
    if(!fileExists(path)) return false;

    const fileStat = statSync(path);
    return fileStat.isFile();;
}