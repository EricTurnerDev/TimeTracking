import {
    CreateClient,
    GetClient,
    DeleteClient,
    GetClients,
    CreateProject,
    DeleteProject,
    GetProjects,
} from '../../lib/ipc-channels';

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

/**
 * Requests the main process to create a client.
 * @returns a promise that resolves when the client is created, or rejects with an error.
 */
export async function createClient(client: IClientTableProps): Promise<void> {
    return await send(CreateClient, client);
}

/**
 * Requests the main process to get a client.
 * @returns a promise that resolves with the client, or rejects with an error.
 */
export async function getClient(client: IClientTableProps): Promise<IClientTableProps> {
    return await send(GetClient, client);
}

/**
 * Requests the main process to delete a client.
 * @returns a promise that resolves when the client is deleted, or rejects with an error.
 */
export async function deleteClient(client: IClientTableProps): Promise<void> {
    return await send(DeleteClient, client);
}

/**
 * Requests a list of all the clients from the main process.
 * @returns a promise that resolves with a list of clients, or rejects with an error.
 */
export async function getClients(): Promise<IClientTableProps[]> {
    return await send(GetClients);
}

/**
 * Requests the main process to create a project.
 * @returns a promise that resolves when the project is created, or rejects with an error.
 */
export async function createProject(project: IProjectTableProps): Promise<void> {
    return await send(CreateProject, project);
}

/**
 * Requests the main process to delete a project.
 * @returns a promise that resolves when the project is deleted, or rejects with an error.
 */
export async function deleteProject(project: IProjectTableProps): Promise<void> {
    return await send(DeleteProject, project);
}

/**
 * Requests a list of projects for a client from the main process.
 * @returns a promise that resolves with a list of projects, or rejects with an error.
 */
export async function getProjects(client: IClientTableProps): Promise<IProjectTableProps[]> {
    return await send(GetProjects, client);
}