import {ipcMain} from 'electron';
import {IpcChannels, Database} from 'timetracking-common';

import Knex from '../db/knex';

let knex;

export async function initialize() {
    knex = await Knex.create();
    await knex.migrate.latest()
        .then(() => console.log('database migration completed'))
        .catch(err => console.error(err));
}

export function listen() {
    // Clients

    ipcMain.handle(IpcChannels.CreateClient, (event, client) => {
        return knex.insert(client).into('clients');
    });

    ipcMain.handle(IpcChannels.GetClient, (event, clientId) => {
        return knex.select().from('clients').where('id', clientId).first();
    });

    ipcMain.handle(IpcChannels.DeleteClient, (event, clientId) => {
        return knex('clients').where('id', clientId).del();
    });

    ipcMain.handle(IpcChannels.GetClients, (event) => {
        return knex.select().from('clients').orderByRaw('client_name COLLATE NOCASE');
    });

    // Projects

    ipcMain.handle(IpcChannels.CreateProject, (event, project) => {
        return knex.insert(project).into('projects');
    });

    ipcMain.handle(IpcChannels.GetProject, (event, projectId) => {
        return knex.select().from('projects').where('id', projectId).first();
    });

    ipcMain.handle(IpcChannels.DeleteProject, (event, projectId) => {
        return knex('projects').where('id', projectId).del();
    });

    ipcMain.handle(IpcChannels.GetProjects, (event, clientId) => {
        return knex.select().from('projects').where('projects.client_id', clientId);
    });

    // Time records

    ipcMain.handle(IpcChannels.GetTimeRecords, (event, {clientId, projectId}: Database.ITimeRecordsQuery) => {
        // GetTimeRecords supports querying by client id, project id, or both. Build the query object
        // based on the arguments received on the IPC channel.

        const query: Database.ITimeRecord = {};
        if (clientId) {
            query.client_id = clientId;
        }
        if (projectId) {
            query.project_id = projectId;
        }
        return knex.select().from('time_records').where(query);
    });

    ipcMain.handle(IpcChannels.GetDetailedTimeRecords, (event, {clientId, projectId}: Database.ITimeRecordsQuery) => {
        // GetTimeRecords supports querying by client id, project id, or both. Build the query object
        // based on the arguments received on the IPC channel.

        const query: Database.ITimeRecord = {};
        if (clientId) {
            query.client_id = clientId;
        }
        if (projectId) {
            query.project_id = projectId;
        }
        const columns = [
            'time_records.*',
            'projects.project_name AS project_name',
            'clients.client_name AS client_name',
            knex.raw('ROUND(((JULIANDAY(time_records.end_ts) - JULIANDAY(time_records.start_ts)) * 24)+time_records.adjustment, 2) AS hours')
        ]
        return knex
            .select(columns)
            .from('time_records')
            .innerJoin('projects', 'time_records.project_id', '=', 'projects.id')
            .innerJoin('clients', 'time_records.client_id', '=', 'clients.id');
        // TODO: Add a where clause with the query
    });
}