import {ipcMain} from 'electron';
import Knex from '../db/knex';
import {ITimeRecordTableProps} from "../../renderer/lib/database";
import {IpcChannels} from "timetracking-common";

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