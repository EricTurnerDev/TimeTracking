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
import path from 'path';
import {getDatabaseLocation} from '../lib/database';

const isProd: boolean = process.env.NODE_ENV === 'production';

export async function create() {
    const dbLocation = getDatabaseLocation();
    console.log(`Database file location: ${dbLocation}`);

    // Migrations are added to the application's resources directory during the build, which is where we need to
    // obtain them when running in production (i.e. from an .exe, .AppImage, etc).
    const migrationsDir = isProd ? path.join(process.resourcesPath, 'main/db/migrations') : './main/db/migrations';
    const seedsDir = isProd ? path.join(process.resourcesPath, 'main/db/seeds') : './main/db/seeds';

    // Override the default knex configuration so it works with the correct SQLite file, migrations, and seed data.
    knexConfig.connection = {filename: dbLocation};
    knexConfig.migrations = {directory: migrationsDir};
    knexConfig.seeds = {directory: seedsDir};

    const k = knex(knexConfig);

    // This enables foreign key support in SQLite
    await k.raw('PRAGMA foreign_keys = ON');

    return k;
}

export default {
    create,
}
