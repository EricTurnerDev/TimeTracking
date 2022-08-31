import {ipcMain} from 'electron';
import Knex from 'knex';
import {ITimeRecordTableProps} from "../../renderer/lib/database";
import {IpcChannels} from "timetracking-common";

let knex;

export async function initialize(dbLocation) {
    console.log(`Database file location: ${dbLocation}`);

    knex = Knex({
        client: 'sqlite3',
        connection: {
            filename: dbLocation
        },
        useNullAsDefault: true // Knex doesn't support default values with sqlite3 yet, so this suppresses that warning.
    });

    // This enables foreign key support in SQLite
    await knex.raw('PRAGMA foreign_keys = ON');

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
            table.string('project_name').unique().notNullable(); // TODO: project name does not need to be unique
            table.integer('client_id')
                .references('clients.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
                .notNullable();
            table.unique(['project_name', 'client_id']);
        });
    }
}

// TODO: Figure out how to enforce the project for the time record to be one of the client's projects. Otherwise
//       we could mistakenly assign a project from a different client.

async function createTimeRecordsTable() {
    const exists = await knex.schema.hasTable('time_records');
    if (!exists) {
        await knex.schema.createTable('time_records', (table) => {
            table.increments('id').primary();
            table.boolean('billable').notNullable().defaultTo(false); // defaultTo doesn't work with sqlite3
            table.timestamp('start_ts').notNullable().defaultTo(knex.fn.now()); // defaultTo doesn't work with sqlite3
            table.timestamp('end_ts').notNullable().defaultTo(knex.fn.now()); // defaultTo doesn't work with sqlite3
            table.decimal('adjustment', 2, 4).notNullable().defaultTo(0.0); // defaultTo doesn't work with sqlite3
            table.text('invoice_activity');
            table.text('work_description');
            table.text('notes');
            table.integer('client_id')
                .references('clients.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
                .notNullable();
            table.integer('project_id')
                .references('projects.id')
                .onDelete('SET NULL');
            table.check('?? >= ??', ['end_ts', 'start_ts']);
        });
    }
}

export function listen() {
    ipcMain.handle(IpcChannels.CreateClient, (event, client) => {
        return knex.insert(client).into('clients');
    });

    ipcMain.handle(IpcChannels.GetClient, (event, client) => {
        return knex.select('*').from('clients').where('id', client.id).first();
    });

    ipcMain.handle(IpcChannels.DeleteClient, (event, client) => {
        return knex('clients').where('id', client.id).del();
    });

    ipcMain.handle(IpcChannels.GetClients, (event, ...args) => {
        return knex.select().from('clients').orderByRaw('client_name COLLATE NOCASE');
    });

    ipcMain.handle(IpcChannels.CreateProject, (event, project) => {
        return knex.insert(project).into('projects');
    });

    ipcMain.handle(IpcChannels.GetProject, (event, project) => {
        return knex.select('*').from('projects').where('id', project.id).first();
    });

    ipcMain.handle(IpcChannels.DeleteProject, (event, project) => {
        return knex('projects').where('id', project.id).del();
    });

    ipcMain.handle(IpcChannels.GetProjects, (event, client) => {
        return knex.select('projects.*').from('projects').join('clients', 'projects.client_id', 'clients.id').where('projects.client_id', client.id);
    });

    ipcMain.handle(IpcChannels.GetTimeRecords, (event, ...args) => {
        // GetTimeRecords supports querying by client_id, project_id, or both. Build the query object
        // based on the arguments received on the IPC channel.

        const query: ITimeRecordTableProps = {};
        if (args && args.length > 0) {
            const data = args[0];
            if (data.client && data.client.id) {
                query.client_id = data.client.id;
            }
            if (data.project && data.project.id) {
                query.project_id = data.project.id;
            }
            return knex.select('*').from('time_records').where(query);
        }

    })
}