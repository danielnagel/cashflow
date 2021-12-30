import { createDirectory, isDirectory, isFile, saveFile } from "../utils/files";

export const saveConfigurationFile = (
    configuration: Configuration,
    path: string,
    force = false,
    name = "config",
): ApplicationError | void => {
    if (!isDirectory(path)) {
        if (!force) {
            return {
                source: "saver.ts",
                message: `Path "${path}" does not exist.`,
            };
        }
        createDirectory(path);
    }

    if (!path.endsWith("/")) path += "/";

    const fileName = `${path}${name}.json`;
    if (!force && isFile(fileName))
        return {
            source: "saver.ts",
            message: `File "${fileName}" already exists.`,
        };

    saveFile(JSON.stringify(configuration, null, 2), fileName);
};

export const exampleConfiguration: Configuration = {
    allowedLogLevel: "error",
    currency: "€",
    dateFormat: "dd.MM.yyyy",
    timeFormat: "HH:mm:ss",
    strict: false,
    startDate: "01.01.2021",
    endDate: "31.12.2021",
    source: {
        type: "csv",
        path: "",
        dataKeys: {
            initiator: "",
            purpose: "",
            value: "",
            date: "",
        },
        columns: [],
        dateFormat: "dd.MM.yyyy",
    },
    categories: [
        {
            name: "example",
            type: "fixed",
            period: "mothly",
            samples: [
                {
                    initiator: "",
                    purpose: "",
                },
            ],
        },
    ],
};
