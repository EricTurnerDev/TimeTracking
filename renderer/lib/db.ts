import {ipcRenderer} from 'electron';

export interface ClientProps {
    id: number;
    client_name: string;
}

export function send(message): Promise<ClientProps[]> {
    return new Promise((resolve, reject) => {
        // Handle responses from the main process.
        ipcRenderer.once('database-query-success', (_, arg) => {
            resolve(arg);
        });

        ipcRenderer.once('database-query-error', (_, arg) => {
            reject(arg);
        });

        // Request a database query from the main process.
        ipcRenderer.send('database-query-request', message);
    });
}
