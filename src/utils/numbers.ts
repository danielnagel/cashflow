/**
 * Turns a german decimal string to a float number.
 * Removes '.' from the string and replaces ',' with '.'.
 * 
 * @param value a string that looks like this "1.234,56".
 * @returns The string as a number representation or NaN.
 */
export const germanDecimalNumberToFloat = (value: string): number => {
    // equals to 1.234,56
    const germanNumberRegex = /^-?\d{1,3}(?:\.\d{3})*(?:,\d+)?$/;
    if(!germanNumberRegex.test(value)) return NaN;
    return parseFloat(value.replace(".", "").replace(",", "."));
}

/**
 * Turns an american decimal string to a float number.
 * 
 * @param value a string that looks like this "1234.56".
 * @returns The string as a number representation or NaN.
 */
export const decimalNumberToFloat = (value: string): number => {
    // equals to 1234.56
    const decimalRegex = /^-?\d+(?:\.\d+)?$/;
    if(!decimalRegex.test(value)) return NaN;
    return parseFloat(value);
}

/**
 * Rounds a decimal number to two digits.
 * 
 * @param value to be rounded.
 * @param delimiter default is "."
 * @returns Given value as rounded string.
 */
export const round = (value: number, delimiter = "."): string => {
    return (Math.round(value * 100)/100).toFixed(2).replace(".", delimiter);
}