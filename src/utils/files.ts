import {
    existsSync,
    readFileSync,
    readdirSync,
    statSync,
    writeFileSync,
    mkdirSync,
} from "fs";

/**
 * Checks if a path exists.
 *
 * @param path to check
 * @returns true if it exist, false otherwise
 */
export const pathExists = (path: string): boolean => {
    return existsSync(path);
};

/**
 * Loads the content from a file.
 *
 * @param path to the file
 * @returns Content of the file as string or null
 */
export const loadFile = (path: string): string | null => {
    if (!pathExists(path)) return null;
    return readFileSync(path).toString();
};

/**
 * Loads all file names from a directory.
 *
 * @param path of the directory
 * @param extension (optional) to match the files to
 * @returns List of file names in a directory,
 * which optionally match a extension
 */
export const loadFileNamesFromDirectory = (
    path: string,
    extension?: string,
): string[] => {
    const fileNames: string[] = [];
    if (pathExists(path) && isDirectory(path)) {
        const fileMetaDatas = readdirSync(path, { withFileTypes: true });
        for (const fileMetaData of fileMetaDatas) {
            if (!fileMetaData.isFile()) continue;
            if (typeof extension !== "undefined") {
                if (fileMetaData.name.endsWith(extension))
                    fileNames.push(fileMetaData.name);
                continue;
            }
            fileNames.push(fileMetaData.name);
        }
    }
    return fileNames;
};

/**
 * Checks if a path is a file.
 *
 * @param path to the file
 * @returns true if its a file, false otherwise
 */
export const isFile = (path: string): boolean => {
    if (!pathExists(path)) return false;

    const fileStat = statSync(path);
    return fileStat.isFile();
};

/**
 * Checks if a path is a directory.
 *
 * @param path to the directory
 * @returns true if its a directory, false otherwise
 */
export const isDirectory = (path: string): boolean => {
    if (!pathExists(path)) return false;

    const fileStat = statSync(path);
    return fileStat.isDirectory();
};

/**
 * Write the content into a file.
 *
 * @param content that should be written into a file
 * @param path to the file
 * @returns true on success, false otherwise
 */
export const saveFile = (content: string, path: string): void => {
    writeFileSync(path, content, { encoding: "utf-8" });
};

/**
 * Creates, recursively, a path to a directory.
 *
 * @param path to the directory
 * @returns true on success, false otherwise
 */
export const createDirectory = (path: string): boolean => {
    if (pathExists(path)) return false;
    mkdirSync(path, { recursive: true });
    return true;
};
