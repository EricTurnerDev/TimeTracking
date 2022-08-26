import {
    CreateClient,
    CreateClientSuccess,
    CreateClientError,
    DeleteClient,
    DeleteClientSuccess,
    DeleteClientError,
    GetClients,
    GetClientsSuccess,
    GetClientsError,
} from '../../lib/ipc-channels';

import {send} from './ipc';

export interface IClientTableProps {
    id?: number;
    client_name?: string;
}

export async function createClient(client: IClientTableProps): Promise<void> {
    await send(CreateClient, CreateClientSuccess, CreateClientError, client);
}

export async function deleteClient(client: IClientTableProps): Promise<void> {
    await send(DeleteClient, DeleteClientSuccess, DeleteClientError, client);
}

export async function getClients(): Promise<IClientTableProps[]> {
    return await send(GetClients, GetClientsSuccess, GetClientsError, {});
}