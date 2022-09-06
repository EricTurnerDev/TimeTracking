/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import knex from 'knex';
import knexConfig from '../knexfile';
import path from "path";
import {app} from "electron";

export function getDatabaseLocation() {
    return path.join(app.getPath('userData'), 'timetracking.sqlite');
}

export async function create() {
    const dbLocation = getDatabaseLocation();
    console.log(`Database file location: ${dbLocation}`);

    // Override the default knex configuration so it works with the correct SQLite file, migrations, and seed data.
    knexConfig.connection = {filename: dbLocation};
    knexConfig.migrations = {directory: './main/db/migrations'};
    knexConfig.seeds = {directory: './main/db/seeds'};

    const k = knex(knexConfig);

    // This enables foreign key support in SQLite
    await k.raw('PRAGMA foreign_keys = ON');

    return k;
}

export default {
    create,
}
