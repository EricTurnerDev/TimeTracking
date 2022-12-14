/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {ipcRenderer} from "electron";

/**
 * Sends data on an IPC channel to the main process, and returns a promise that either resolves with
 * a successful response, or rejects with an error.
 *
 * The promise can also reject with an error when attempting to use this function in a context that does not support
 * Electron's IPC (e.g. SSR with getServerSideProps in a Next.js page).
 */
export async function send(channel: string, data?: any): Promise<any> {
    if (ipcRenderer) {
        return await ipcRenderer.invoke(channel, data)
    } else {
        return Promise.reject(new Error("Electron's ipcRenderer does not support SSR"));
    }
}
