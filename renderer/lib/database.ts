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

export async function createClient(client: IClientTableProps): Promise<void> {
    return await send(CreateClient, client);
}

export async function deleteClient(client: IClientTableProps): Promise<void> {
    return await send(DeleteClient, client);
}

export async function getClients(): Promise<IClientTableProps[]> {
    return await send(GetClients, {});
}