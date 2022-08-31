/**
 * A query parameter can be a single value, or an array of values, depending on if the query parameter was repeated
 * in the URL.
 *
 * @param param A string or array of strings representing integers
 */
export function parseIntQueryParam(param: string | string[]): number[] {
    let converted: number[];

    try {
        if (typeof param === 'string') {
            converted = [parseInt(param)];
        } else {
            converted = param.map(p => parseInt(p));
        }
    } catch (e) {
        converted = [];
    }

    return converted;
}
