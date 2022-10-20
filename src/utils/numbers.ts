/**
 * Turns a german decimal string to a float number.
 * Removes '.' from the string and replaces ',' with '.'.
 *
 * @param value a string that looks like this "1.234,56".
 * @returns The string as a number representation or NaN.
 */
export const germanDecimalNumberToFloat = (
    value: string | undefined,
): number => {
    if (typeof value === "undefined") return NaN;
    // equals to 1.234,56
    const germanNumberRegex = /^-?\d{1,3}(?:\.\d{3})*(?:,\d+)?$/;
    if (!germanNumberRegex.test(value)) return NaN;
    return parseFloat(value.replace(".", "").replace(",", "."));
};

/**
 * Turns an american decimal string to a float number.
 *
 * @param value a string that looks like this "1234.56".
 * @returns The string as a number representation or NaN.
 */
export const decimalNumberToFloat = (value: string | undefined): number => {
    if (typeof value === "undefined") return NaN;
    // equals to 1234.56
    const decimalRegex = /^-?\d+(?:\.\d+)?$/;
    if (!decimalRegex.test(value)) return NaN;
    return parseFloat(value);
};

/**
 * Rounds a decimal number to a two digits long string.
 *
 * @param value to be rounded.
 * @param delimiter default is "."
 * @returns Given value as rounded string.
 */
export const roundToString = (value: number, delimiter = "."): string => {
    return round(value).toFixed(2).replace(".", delimiter);
};

/**
 * Rounds a decimal number to two digits.
 *
 * @param value to be rounded.
 * @returns Given value as rounded to two digits.
 */
export const round = (value: number): number => {
    return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};
