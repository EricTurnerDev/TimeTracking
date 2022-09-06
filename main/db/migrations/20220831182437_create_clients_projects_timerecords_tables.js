/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// TODO: Figure out how to enforce the project for the time record to be one of the client's projects. Otherwise
//       we could mistakenly assign a project from a different client. The UI ensures this should never happen, but it
//       would be better to enforce it in the database as well.

exports.up = function(knex) {
    return knex.schema.createTable('clients', (table) => {
        table.increments('id').primary();
        table.string('client_name').unique().notNullable();
    }).createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('project_name').notNullable();
        table.integer('client_id')
            .references('clients.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.unique(['project_name', 'client_id']);
    }).createTable('time_records', (table) => {
        table.increments('id').primary();
        table.boolean('billable').notNullable().defaultTo(false);
        table.timestamp('start_ts').notNullable().defaultTo(knex.raw("(strftime('%Y-%m-%dT%H:%M:%SZ','now'))"));
        table.timestamp('end_ts').notNullable().defaultTo(knex.raw("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"));
        table.decimal('adjustment', 2, 4).notNullable().defaultTo(0.0);
        table.text('invoice_activity').notNullable();
        table.text('work_description').notNullable();
        table.text('notes').nullable();
        table.integer('client_id')
            .references('clients.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable();
        table.integer('project_id')
            .references('projects.id')
            .nullable()
            .onUpdate('CASCADE')
            .onDelete('SET NULL'); // If the project is deleted, the time record will still be associated with the client.
        table.check('?? >= ??', ['end_ts', 'start_ts']);
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('time_records')
        .dropTable('projects')
        .dropTable('clients');
};
