import {ipcRenderer} from "electron";

export function send(channel, successChannel, errorChannel, data): any|any[] {
    if (ipcRenderer) {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(successChannel, (_, arg) => {
                resolve(arg);
            });

            ipcRenderer.once(errorChannel, (_, arg) => {
                reject(arg);
            });

            ipcRenderer.send(channel, data);
        });
    } else {
        return Promise.reject({error: "Electron's ipcRenderer does not support SSR"});
    }
}
