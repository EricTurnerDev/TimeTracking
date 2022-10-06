/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {app, ipcMain} from 'electron';
import path from 'path';
import {IpcChannels, DatabaseInterfaces as dbi} from 'timetracking-common';

import Knex from '../db/Knex';

let knex;

export async function initialize() {
    knex = await Knex.create();
    await knex.migrate.latest()
        .then(() => console.log('database migration completed'))
        .catch(err => console.error(err));
}

export async function reInitialize() {
    await knex.destroy()
    await initialize();
}

export function getDatabaseLocation() {
    return path.join(app.getPath('userData'), 'timetracking.sqlite');
}

export function getDetailedTimeRecords(query: dbi.ITimeRecordsQuery) {

    const columns = [
        'time_records.*',
        'projects.project_name AS project_name',
        'clients.client_name AS client_name',
        knex.raw('ROUND(((JULIANDAY(time_records.end_ts) - JULIANDAY(time_records.start_ts)) * 24)+time_records.adjustment, 2) AS hours')
    ]

    let k = knex
        .select(columns)
        .from('time_records')
        .innerJoin('clients', 'time_records.client_id', '=', 'clients.id')
        .leftJoin('projects', 'time_records.project_id', '=', 'projects.id')
        .orderBy('time_records.start_ts', 'desc');

    k = addTimeRecordsWhereClause(k, query);

    return k;
}

export function listen() {
    // Clients

    ipcMain.handle(IpcChannels.CreateClient, (event, client: dbi.IClient) => {
        return knex.insert(client).into('clients');
    });

    ipcMain.handle(IpcChannels.GetClient, (event, clientId: number) => {
        return knex.select().from('clients').where('id', clientId).first();
    });

    ipcMain.handle(IpcChannels.DeleteClient, (event, clientId: number) => {
        return knex('clients').where('id', clientId).del();
    });

    ipcMain.handle(IpcChannels.UpdateClient, (event, client: dbi.IClient) => {
        return knex('clients').where('id', client.id).update(client);
    });

    ipcMain.handle(IpcChannels.GetClients, (event) => {
        return knex.select().from('clients').orderByRaw('client_name COLLATE NOCASE');
    });

    // Projects

    ipcMain.handle(IpcChannels.CreateProject, (event, project: dbi.IProject) => {
        return knex.insert(project).into('projects');
    });

    ipcMain.handle(IpcChannels.GetProject, (event, projectId: number) => {
        return knex.select().from('projects').where('id', projectId).first();
    });

    ipcMain.handle(IpcChannels.DeleteProject, (event, projectId: number) => {
        return knex('projects').where('id', projectId).del();
    });

    ipcMain.handle(IpcChannels.UpdateProject, (event, project: dbi.IProject) => {
        return knex('projects').where('id', project.id).update(project);
    });

    ipcMain.handle(IpcChannels.GetProjects, (event, {clientId, projectId}: dbi.IProjectsQuery) => {
        const query: dbi.IProject = {};
        if (clientId) {
            query.client_id = clientId;
        }
        if (projectId) {
            query.id = projectId;
        }
        const columns = [
            'projects.*',
            'clients.id as client_id',
        ]
        return knex
            .select(columns)
            .from('projects')
            .innerJoin('clients', 'clients.id', '=', 'projects.client_id')
            .where(query)
            .orderByRaw('project_name COLLATE NOCASE');
    });

    // Time records

    ipcMain.handle(IpcChannels.CreateTimeRecord, (event, timeRecord: dbi.ITimeRecord) => {
        return knex.insert(timeRecord).into('time_records');
    });

    ipcMain.handle(IpcChannels.GetTimeRecord, (event, timeRecordId: number) => {
        return knex.select().from('time_records').where('id', timeRecordId).first();
    });

    ipcMain.handle(IpcChannels.GetDetailedTimeRecord, (event, timeRecordId: number) => {
        const columns = [
            'time_records.*',
            'projects.project_name AS project_name',
            'clients.client_name AS client_name',
            knex.raw('ROUND(((JULIANDAY(time_records.end_ts) - JULIANDAY(time_records.start_ts)) * 24)+time_records.adjustment, 2) AS hours')
        ]

        return knex
            .select(columns)
            .from('time_records')
            .innerJoin('clients', 'time_records.client_id', '=', 'clients.id')
            .leftJoin('projects', 'time_records.project_id', '=', 'projects.id')
            .where({'time_records.id': timeRecordId})
            .first();
    });

    ipcMain.handle(IpcChannels.DeleteTimeRecord, (event, timeRecordId: number) => {
        return knex('time_records').where('id', timeRecordId).del();
    })

    ipcMain.handle(IpcChannels.UpdateTimeRecord, (event, timeRecord: dbi.ITimeRecord) => {
        return knex('time_records').where('id', timeRecord.id).update(timeRecord);
    });

    ipcMain.handle(IpcChannels.GetTimeRecords, (event, query: dbi.ITimeRecordsQuery) => {
        let k = knex.select().from('time_records');
        k = addTimeRecordsWhereClause(k, query);
        return k
    });

    ipcMain.handle(IpcChannels.GetDetailedTimeRecords, (event, query: dbi.ITimeRecordsQuery) => {
        return getDetailedTimeRecords(query);
    });

    ipcMain.handle(IpcChannels.GetActivityMapValues, (event) => {
        return knex.raw(`SELECT strftime('%Y-%m-%d', start_ts) as date,
                                SUM(ROUND(((JULIANDAY(end_ts) - JULIANDAY(start_ts)) * 24)+adjustment, 2)) as count
                         FROM time_records
                         WHERE start_ts > date('now','-1 year')
                         GROUP BY date
                         ORDER BY date DESC`);
    });

    ipcMain.handle(IpcChannels.GetActivitySummaryValues, (event, query: dbi.ITimeRecordsQuery) => {
        let k = knex.from('time_records')
                    .select(knex.raw(`COUNT(distinct client_id) as num_clients,
                                      COUNT(distinct project_id) as num_projects,
                                      SUM(ROUND(((JULIANDAY(end_ts) - JULIANDAY(start_ts)) * 24)+adjustment, 2)) as total_hours,
                                      SUM(CASE WHEN billable=1 THEN ROUND(((JULIANDAY(end_ts) - JULIANDAY(start_ts)) * 24)+adjustment, 2) ELSE 0 END) as billable_hours,
                                      SUM(CASE WHEN billable=0 THEN ROUND(((JULIANDAY(end_ts) - JULIANDAY(start_ts)) * 24)+adjustment, 2) ELSE 0 END) as non_billable_hours`));
        k = addTimeRecordsWhereClause(k, query);
        return k;
    });

    /**
     * Use the database to calculate the number of hours between two times.
     */
    ipcMain.handle(IpcChannels.GetHours, (event, {startTs, endTs, adjustment=0}) => {
        return knex.raw(`SELECT ROUND(((JULIANDAY('${endTs}') - JULIANDAY('${startTs}')) * 24)+${adjustment}, 2) AS hours`);
    });
}

function addTimeRecordsWhereClause(k, {clientId, projectId, startTs}: dbi.ITimeRecordsQuery) {
    let query;
    if (clientId || projectId) {
        query = {};
        if (clientId) {
            query.client_id = clientId;
        }
        if (projectId) {
            query.project_id = projectId;
        }
        k = k.where(query);
    }

    if (startTs) {
        if (query) {
            k = k.andWhere('start_ts', '>=', 'startTs');
        } else {
            k = k.where('start_ts', '>=', startTs);
        }
    }

    return k;
}