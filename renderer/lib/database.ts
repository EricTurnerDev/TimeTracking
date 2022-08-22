import {ipcRenderer} from 'electron';
import {DatabaseQuery, DatabaseQuerySuccess, DatabaseQueryError} from '../../lib/ipc-channels';

export interface IClientTableProps {
    id?: number;
    client_name?: string;
}

function quoteValue(val) {
    return typeof val === 'string' ? `'${val}'` : val;
}

export async function addClient(client: IClientTableProps): Promise<void> {
    const keys = Object.keys(client).map(quoteValue);

    const values = Object.values(client).map(quoteValue);

    // TODO: This doesn't handle ' in the values (e.g. Bob's Burgers & Brew). Suggest moving all SQL to the
    // main process, and just send messages like add-client, delete-client, etc via IPC. Then we should be able to use
    // something like knex so we aren't building SQL statements as strings.
    let sql = `INSERT INTO clients (${keys.join()}) VALUES (${values.join()})`;

    await query(sql);
}

export async function updateClient(client: IClientTableProps): Promise<void> {

    const updates = Object.entries(client).map(([k, v]) => {
        return `${k}=${quoteValue(v)}`
    })

    let sql = `UPDATE clients SET ${updates.join()} WHERE id=${client.id}`;

    await query(sql);
}

export async function deleteClient(client: IClientTableProps): Promise<void> {
    const sql = `DELETE FROM clients WHERE id=${client.id}`;
    await query(sql);
}

export async function getClient(clientId: number): Promise<IClientTableProps> {
    return {};
}

export async function getClients(): Promise<IClientTableProps[]> {
    let clients: IClientTableProps[] = [];
    try {
        clients = await query('SELECT * FROM clients ORDER BY client_name COLLATE NOCASE');
    } catch (err) {
        console.error(err);
    }
    return clients;
}

function query(sql): Promise<any[]> {
    if (ipcRenderer) {
        return new Promise((resolve, reject) => {
            // Handle responses from the main process.
            ipcRenderer.once(DatabaseQuerySuccess, (_, arg) => {
                resolve(arg);
            });

            ipcRenderer.once(DatabaseQueryError, (_, arg) => {
                reject(arg);
            });

            // Request a database query from the main process.
            ipcRenderer.send(DatabaseQuery, sql);
        });
    } else {
        console.error("Electron's ipcRenderer does not support SSR");
        return Promise.reject([])
    }
}
