/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {DateTime} from 'luxon';

export const isoToLocale = (iso: string): string => {
    if (iso) {
        return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT);
    } else {
        return '';
    }
};

export const utcISOToLocalISO = (utc: string): string => {
    if (utc) {
        return DateTime.fromISO(utc).toLocal().toFormat("yyyy-MM-dd'T'hh:mm");
    } else {
        return '';
    }
}

export const localISOToUTCISO = (local: string): string => {
    if (local) {
        return DateTime.fromISO(local).toUTC().toISO();
    } else {
        return '';
    }
}
