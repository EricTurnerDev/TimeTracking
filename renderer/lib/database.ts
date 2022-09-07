/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {IpcChannels, Database} from "timetracking-common";

import {send} from './ipc';

/**
 * Requests the main process to create a client.
 * @returns a promise that resolves when the client is created, or rejects with an error.
 */
export async function createClient(client: Database.IClient): Promise<void> {
    return await send(IpcChannels.CreateClient, client);
}

/**
 * Requests the main process to get a client.
 * @returns a promise that resolves with the client, or rejects with an error.
 */
export async function getClient(id:number): Promise<Database.IClient> {
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
 * Requests a list of all the clients from the main process.
 * @returns a promise that resolves with a list of clients, or rejects with an error.
 */
export async function getClients(): Promise<Database.IClient[]> {
    return await send(IpcChannels.GetClients);
}

/**
 * Requests the main process to create a project.
 * @returns a promise that resolves when the project is created, or rejects with an error.
 */
export async function createProject(project: Database.IProject): Promise<void> {
    return await send(IpcChannels.CreateProject, project);
}

/**
 * Requests the main process to get a project.
 * @returns a promise that resolves with the project, or rejects with an error.
 */
export async function getProject(id:number): Promise<Database.IProject> {
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
export async function updateProject(id: number, project: Database.IProject): Promise<void> {
    return await send(IpcChannels.UpdateProject, {...project, id});
}

/**
 * Requests a list of projects for a client from the main process.
 * @returns a promise that resolves with a list of projects, or rejects with an error.
 */
export async function getProjects(clientId:number): Promise<Database.IProject[]> {
    return await send(IpcChannels.GetProjects, clientId);
}

/**
 * Requests the main process to create a time record.
 * @returns a promise that resolves when the time record is created, or rejects with an error.
 */
export async function createTimeRecord(timeRecord: Database.ITimeRecord): Promise<void> {
    return await send(IpcChannels.CreateTimeRecord, timeRecord);
}

/**
 * Requests the main process to delete a time record.
 * @returns a promise that resolves when the time record is deleted, or rejects with an error.
 */
export async function deleteTimeRecord(id:number): Promise<void> {
    return await send(IpcChannels.DeleteTimeRecord, id);
}

/**
 * Request a list of time records for a client and/or project from the main process.
 * @returns a promise that resolves with a list of time records, or rejects with an error.
 */
export async function getTimeRecords(query: Database.ITimeRecordsQuery): Promise<Database.ITimeRecord[]> {
    return await send(IpcChannels.GetTimeRecords, query);
}

/**
 * Request a list of time records for a client and/or project from the main process.
 * @returns a promise that resolves with a list of time records, or rejects with an error.
 */
export async function getDetailedTimeRecords(query: Database.ITimeRecordsQuery): Promise<Database.IDetailedTimeRecord[]> {
    return await send(IpcChannels.GetDetailedTimeRecords, query);
}