/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Adds an 's' on the end of something if count is not 1.
 */
export default function pluralize(noun: string, count: number) {
    return `${noun}${count !== 1 ? 's' : ''}`
}