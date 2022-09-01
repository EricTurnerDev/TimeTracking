import {IpcChannels, QueryInterfaces} from "timetracking-common";

import {send} from './ipc';

export interface IClientTableProps {
    id?: number;
    client_name?: string;
}

export interface IProjectTableProps {
    id?: number;
    project_name?: string,
    client_id?: number;
}

export interface ITimeRecordTableProps {
    id?: number;
    billable?: boolean;
    start_ts?: string;
    end_ts?: string;
    adjustment?: number;
    invoice_activity?: string;
    work_description?: string;
    notes?: string;
    client_id?: number;
    project_id?: number;
}

/**
 * Requests the main process to create a client.
 * @returns a promise that resolves when the client is created, or rejects with an error.
 */
export async function createClient(client: IClientTableProps): Promise<void> {
    return await send(IpcChannels.CreateClient, client);
}

/**
 * Requests the main process to get a client.
 * @returns a promise that resolves with the client, or rejects with an error.
 */
export async function getClient(id:number): Promise<IClientTableProps> {
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
export async function getClients(): Promise<IClientTableProps[]> {
    return await send(IpcChannels.GetClients);
}

/**
 * Requests the main process to create a project.
 * @returns a promise that resolves when the project is created, or rejects with an error.
 */
export async function createProject(project: IProjectTableProps): Promise<void> {
    return await send(IpcChannels.CreateProject, project);
}

/**
 * Requests the main process to get a project.
 * @returns a promise that resolves with the project, or rejects with an error.
 */
export async function getProject(id:number): Promise<IProjectTableProps> {
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
 * Requests a list of projects for a client from the main process.
 * @returns a promise that resolves with a list of projects, or rejects with an error.
 */
export async function getProjects(clientId:number): Promise<IProjectTableProps[]> {
    return await send(IpcChannels.GetProjects, clientId);
}

/**
 * Request a list of time records for a client and/or project from the main process.
 * @returns a promise that resolves with a list of time records, or rejects with an error.
 */
export async function getTimeRecords(query: QueryInterfaces.ITimeRecordsQuery): Promise<ITimeRecordTableProps[]> {
    return await send(IpcChannels.GetTimeRecords, query);
}
