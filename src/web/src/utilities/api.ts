import { isApplicationError } from "../../../utils/typeguards";

/**
 * GET request to backend
 *
 * @param relativeUrl to wanted endpoint
 * @returns expected result object or rejects with an error message
 */
export const getApi = async (
    relativeUrl: string,
): Promise<TrendReportTableRow[] | CategorizedFixedPayDays | Transaction[]> => {
    if (relativeUrl.length > 0 && !relativeUrl.startsWith("/"))
        relativeUrl = "/" + relativeUrl;

    const url = `http://${process.env.BACKEND_ADDRESS}${relativeUrl}`;

    let response = null;
    try {
        response = await fetch(url);
    } catch (e: any) {
        return Promise.reject(`Backend server is unreachable.`);
    }

    try {
        const json = await response.json();
        if (isApplicationError(json)) {
            return Promise.reject(json.message);
        }
        return Promise.resolve(json);
    } catch (e: any) {
        return Promise.reject(`Couldn't parse JSON data.`);
    }
};
