/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {IpcChannels, DatabaseInterfaces} from 'timetracking-common';

import {send} from './ipc';

// Clients

/**
 * Requests the main process to create a client.
 * @returns a promise that resolves when the client is created, or rejects with an error.
 */
export async function createClient(client: DatabaseInterfaces.IClient): Promise<void> {
    return await send(IpcChannels.CreateClient, client);
}

/**
 * Requests the main process to get a client.
 * @returns a promise that resolves with the client, or rejects with an error.
 */
export async function getClient(id:number): Promise<DatabaseInterfaces.IClient> {
    return await send(IpcChannels.GetClient, id);
}

/**
 * Requests the main process to delete a client.
 * @returns a promise that resolves when the client is deleted, or rejects with an error.
 */
export async function deleteClient(id:number): Promise<void> {
    return await send(IpcChannels.DeleteClient, id);
}

/**
 * Requests the main process to update a client.
 * @returns a promise that resolves when the client is updated, or rejects with an error.
 */
export async function updateClient(id: number, client: DatabaseInterfaces.IClient): Promise<void> {
    return await send(IpcChannels.UpdateClient, {...client, id});
}


/**
 * Requests a list of all the clients from the main process.
 * @returns a promise that resolves with a list of clients, or rejects with an error.
 */
export async function getClients(): Promise<DatabaseInterfaces.IClient[]> {
    return await send(IpcChannels.GetClients);
}

// Projects

/**
 * Requests the main process to create a project.
 * @returns a promise that resolves when the project is created, or rejects with an error.
 */
export async function createProject(project: DatabaseInterfaces.IProject): Promise<void> {
    return await send(IpcChannels.CreateProject, project);
}

/**
 * Requests the main process to get a project.
 * @returns a promise that resolves with the project, or rejects with an error.
 */
export async function getProject(id:number): Promise<DatabaseInterfaces.IProject> {
    return await send(IpcChannels.GetProject, id);
}


/**
 * Requests the main process to delete a project.
 * @returns a promise that resolves when the project is deleted, or rejects with an error.
 */
export async function deleteProject(id:number): Promise<void> {
    return await send(IpcChannels.DeleteProject, id);
}

/**
 * Requests the main process to update a project.
 * @returns a promise that resolves when the project is updated, or rejects with an error.
 */
export async function updateProject(id: number, project: DatabaseInterfaces.IProject): Promise<void> {
    return await send(IpcChannels.UpdateProject, {...project, id});
}

/**
 * Requests a list of projects from the main process.
 * @returns a promise that resolves with a list of projects, or rejects with an error.
 */
export async function getProjects(query:DatabaseInterfaces.IProjectsQuery): Promise<DatabaseInterfaces.IProject[]> {
    return await send(IpcChannels.GetProjects, query);
}

// Time records

/**
 * Requests the main process to create a time record.
 * @returns a promise that resolves when the time record is created, or rejects with an error.
 */
export async function createTimeRecord(timeRecord: DatabaseInterfaces.ITimeRecord): Promise<void> {
    return await send(IpcChannels.CreateTimeRecord, timeRecord);
}

/**
 * Requests the main process to get a time record.
 * @returns a promise that resolves with the time record, or rejects with an error.
 */
export async function getTimeRecord(id: number): Promise<DatabaseInterfaces.ITimeRecord> {
    return await send(IpcChannels.GetTimeRecord, id);
}

/**
 * Requests the main process to get a detailed time record.
 * @returns a promise that resolves with the detailed time record, or rejects with an error.
 */
export async function getDetailedTimeRecord(id: number): Promise<DatabaseInterfaces.ITimeRecord> {
    return await send(IpcChannels.GetDetailedTimeRecord, id);
}

/**
 * Requests the main process to delete a time record.
 * @returns a promise that resolves when the time record is deleted, or rejects with an error.
 */
export async function deleteTimeRecord(id:number): Promise<void> {
    return await send(IpcChannels.DeleteTimeRecord, id);
}

/**
 * Requests the main process to update a time record.
 * @returns a promise that resolves when the time record is updated, or rejects with an error.
 */
export async function updateTimeRecord(timeRecord: DatabaseInterfaces.ITimeRecord): Promise<void> {
    return await send(IpcChannels.UpdateTimeRecord, timeRecord);
}

/**
 * Request a list of time records for a client and/or project from the main process.
 * @returns a promise that resolves with a list of time records, or rejects with an error.
 */
export async function getTimeRecords(query: DatabaseInterfaces.ITimeRecordsQuery): Promise<DatabaseInterfaces.ITimeRecord[]> {
    return await send(IpcChannels.GetTimeRecords, query);
}

/**
 * Request a list of time records for a client and/or project from the main process.
 * @returns a promise that resolves with a list of time records, or rejects with an error.
 */
export async function getDetailedTimeRecords(query: DatabaseInterfaces.ITimeRecordsQuery): Promise<DatabaseInterfaces.IDetailedTimeRecord[]> {
    return await send(IpcChannels.GetDetailedTimeRecords, query);
}

export async function getActivityMapValues() {
    return await send(IpcChannels.GetActivityMapValues);
}

/**
 * Prompts the user to download the SQLite database
 */
export async function downloadDatabaseFile(): Promise<Buffer> {
    return await send(IpcChannels.DownloadDatabaseFile);
}

/**
 * Prompts the user to download a spreadsheet of time records.
 */
export async function exportSpreadsheet(query={}): Promise<void> {
    return await send(IpcChannels.ExportSpreadsheet, query);
}