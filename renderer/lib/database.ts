import {ipcRenderer} from 'electron';
import {DatabaseQuery, DatabaseQuerySuccess, DatabaseQueryError} from '../../lib/ipc-channels';

export interface ClientProps {
    id?: number;
    client_name?: string;
}

export async function addClient(client: ClientProps): Promise<void> {
    const keys = Object.keys(client);

    const values = Object.values(client).map((val) => {
        return typeof val === "string" ? `'${val}'` : val;
    });

    let sql = `INSERT INTO clients (${keys.join()}) VALUES (${values.join()})`;

    console.log(sql);

    // try {
    //     await query(sql);
    // } catch (err) {
    //     console.error(err);
    // }
}

export async function updateClient(client: ClientProps): Promise<void> {

}

export async function deleteClient(client: ClientProps): Promise<void> {

}

export async function getClient(clientId: number): Promise<ClientProps> {
    return {};
}

export async function getClients(): Promise<ClientProps[]> {
    let clients: ClientProps[] = [];
    try {
        clients = await query('SELECT * FROM clients');
    } catch (err) {
        console.error(err);
    }
    return clients;
}

function query(sql): Promise<any[]> {
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
}
