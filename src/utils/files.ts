import { existsSync, readFileSync } from "fs"

export const fileExists = (path: string): boolean => {
    return existsSync(path);
}

export const loadFile = (path: string): string | null => {
    if(!fileExists(path)) return null;
    return readFileSync(path).toString();
}