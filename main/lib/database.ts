import {ipcMain} from 'electron';
import * as IpcChannel from '../../lib/ipc-channels';
import Knex from 'knex';

// Code in modules only executes once (the first time a module is imported somewhere), so we won't be creating multiple
// knex objects.
const knex = Knex({
   client: 'sqlite3',
   connection: {
       filename: './timetracking.sqlite'
   }
});

export async function up() {
    await createClientsTable();
    await createProjectsTable();
    await createTimeRecordsTable();
}

async function createClientsTable() {
    const exists = await knex.schema.hasTable('clients');
    if (!exists) {
        await knex.schema.createTable('clients', (table) => {
            table.increments('id').primary();
            table.string('client_name').unique().notNullable();
        })
    }
}

async function createProjectsTable() {
    const exists = await knex.schema.hasTable('projects');
    if (!exists) {
        await knex.schema.createTable('projects', (table) => {
            table.increments('id').primary();
            table.string('project_name').unique().notNullable();
            table.integer('client_id').references('clients.id').notNullable();
            table.unique(['project_name', 'client_id']);
        })
    }
}

async function createTimeRecordsTable() {
    const exists = await knex.schema.hasTable('time_records');
    if (!exists) {
        await knex.schema.createTable('time_records', (table) => {
            table.increments('id').primary();
            table.boolean('billable').notNullable().defaultTo(false);
            table.timestamp('start_ts').notNullable().defaultTo(knex.fn.now());
            table.timestamp('end_ts').notNullable().defaultTo(knex.fn.now());
            table.decimal('adjustment', 2, 4).notNullable().defaultTo(0.0);
            table.text('invoice_activity');
            table.text('work_description');
            table.text('notes');
            table.integer('project_id').references('projects.id').notNullable();
            table.check('?? >= ??', ['end_ts', 'start_ts']);
        });
    }
}

export function listen() {
    ipcMain.handle(IpcChannel.GetClients, (event, ...args) => {
        return knex.select().from('clients').orderByRaw('client_name COLLATE NOCASE');
    });

    ipcMain.handle(IpcChannel.CreateClient, (event, client) => {
        return knex.insert(client).into('clients');
    });

    ipcMain.handle(IpcChannel.DeleteClient, (event, client) => {
        return knex('clients').where('id', client.id).del();
    });
}