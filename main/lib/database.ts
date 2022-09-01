import {ipcMain} from 'electron';
import Knex from '../db/knex';
import {ITimeRecordTableProps} from "../../renderer/lib/database";
import {IpcChannels, QueryInterfaces} from "timetracking-common";

let knex;

export async function initialize() {
    knex = await Knex.create();
    await knex.migrate.latest()
        .then(() => console.log('database migration completed'))
        .catch(err => console.error(err));
}

export function listen() {
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

    ipcMain.handle(IpcChannels.GetTimeRecords, (event, {clientId, projectId}: QueryInterfaces.ITimeRecordsQuery) => {
        // GetTimeRecords supports querying by client id, project id, or both. Build the query object
        // based on the arguments received on the IPC channel.

        const query: ITimeRecordTableProps = {};
        if (clientId) {
            query.client_id = clientId;
        }
        if (projectId) {
            query.project_id = projectId;
        }
        return knex.select().from('time_records').where(query);
    })
}