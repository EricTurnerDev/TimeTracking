/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {app, BrowserWindow, ipcMain} from 'electron';
import {download} from 'electron-dl';
import serve from 'electron-serve';
import {DateTime} from 'luxon';
import {DatabaseInterfaces, IpcChannels} from "timetracking-common";
import XLSX from 'xlsx';

import * as db from './lib/database';
import {createWindow} from './helpers';
import path from "path";

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({directory: 'app'});
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    // Create the sqlite database if it doesn't exist, and register listeners to handle requests from the renderer process.
    try {
        await db.initialize();
        db.listen();
    } catch (err) {
        console.error(err);
    }

    const mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
    });

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }

    // Handle requests to download the sqlite database file
    ipcMain.handle(IpcChannels.DownloadDatabaseFile, async (event) => {
        const timestamp = DateTime.now().toFormat('yyyyLLddHHmmss');
        const filename = `${timestamp}-timetracking.sqlite`;
        const dl = await download(
            BrowserWindow.getFocusedWindow(),
            db.getDatabaseLocation(),
            {
                saveAs: true,
                directory: app.getPath('downloads'),
                filename
            });
        mainWindow.webContents.send("download complete", dl.getSavePath());
    });

    // Handle requests to export a spreadsheet of time records.
    ipcMain.handle(IpcChannels.ExportSpreadsheet, async (event, query: DatabaseInterfaces.ITimeRecordsQuery) => {
        const originalRows: DatabaseInterfaces.IDetailedTimeRecord[] = await db.getDetailedTimeRecords(query);

        // Remove columns we don't want
        const rows = originalRows.map(({id, client_id, project_id, ...rest}) => rest);

        // Generate worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Records');

        // Create and save the XLSX file to a temp directory
        const fileLocation = path.join(app.getPath('temp'), 'timetracking.xlsx');
        XLSX.writeFile(workbook, fileLocation);

        // Prompt the user to download the file to wherever they want it.
        const timestamp = DateTime.now().toFormat('yyyyLLddHHmmss');
        const filename = `${timestamp}-timetracking.xlsx`;
        const dl = await download(
            BrowserWindow.getFocusedWindow(),
            fileLocation,
            {
                saveAs: true,
                directory: app.getPath('downloads'),
                filename
            });
        mainWindow.webContents.send("download complete", dl.getSavePath());
    });

})();

app.on('window-all-closed', () => {
    app.quit();
});
