import { existsSync } from "fs"

export const fileExists = (path: string): boolean => {
    return existsSync(path);
}