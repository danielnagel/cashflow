/**
 * Turns an german decimal string to a float number.
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