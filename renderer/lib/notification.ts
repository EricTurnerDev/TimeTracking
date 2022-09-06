/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Sends the user a desktop notification.
 */
export function notify(title, body) {
    // TODO: Notification should.... ?
    new Notification(title, {
        body,
    }).onclick = () => console.log('Notification Clicked');
}
