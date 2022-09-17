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
    return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT);
};

export const utcISOToLocalISO = (utc: string): string => {
    return DateTime.fromISO(utc).toLocal().toFormat("yyyy-MM-dd'T'hh:mm");
}

export const localISOToUTCISO = (local: string): string => {
    return DateTime.fromISO(local).toUTC().toISO();
}
