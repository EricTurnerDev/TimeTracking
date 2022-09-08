/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {DateTime} from 'luxon';

const convert = (utc: string): string => {
    return DateTime.fromISO(utc).toLocaleString(DateTime.DATETIME_MED);
};

export default convert;