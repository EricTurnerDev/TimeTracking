import {
    CreateClient,
    DeleteClient,
    GetClients,
} from '../../lib/ipc-channels';

import {send} from './ipc';

export interface IClientTableProps {
    id?: number;
    client_name?: string;
}

/**
 * Requests the main process to create a client.
 * @returns a promise that resolves when the client is created, or rejects with an error.
 */
export async function createClient(client: IClientTableProps): Promise<void> {
    return await send(CreateClient, client);
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
 * @returns a promise that resolves to a list of clients, or rejects with an error.
 */
export async function getClients(): Promise<IClientTableProps[]> {
    return await send(GetClients, {});
}