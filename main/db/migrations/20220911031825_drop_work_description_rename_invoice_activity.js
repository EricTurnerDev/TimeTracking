/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

exports.up = function (knex) {
    return knex.schema.alterTable('time_records', table => {
        table.dropColumn('work_description')
            .renameColumn('invoice_activity', 'description');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('time_records', table => {
        table.renameColumn('description', 'invoice_activity');
    }).alterTable('time_records', table => {
        table.string('work_description').defaultTo('').notNullable();
    });
};
