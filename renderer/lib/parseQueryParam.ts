/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
