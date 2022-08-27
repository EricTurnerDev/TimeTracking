import sqlite3 from 'sqlite3';
import {ipcMain} from 'electron';
import * as IpcChannel from '../../lib/ipc-channels';

export function createDatabase(): sqlite3.Database {
    const database = new sqlite3.Database('./timetracking.db', (err) => {
        if (err) {
            console.error('Unable to open database: ', err);
        } else {
            console.log('Database was successfully created');
        }
    });

    if (database) {
        createDatabaseSchema(database);
    }

    return database;
}

function createDatabaseSchema(database: sqlite3.Database) {
    database.serialize(() => {
        createClientsTable(database);
        createProjectsTable(database);
        createTimeRecordsTable(database);
    });
}

function createClientsTable(database) {
    database.run(`CREATE TABLE IF NOT EXISTS clients (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       client_name TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            // Error creating table
            console.error(err);
        }
    });
}

function createProjectsTable(database) {
    database.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_name TEXT NOT NULL UNIQUE,
        client_id INTEGER NOT NULL,
        FOREIGN KEY (client_id)
            REFERENCES clients (id),
        UNIQUE(project_name,client_id)
    )`, (err) => {
        if (err) {
                // Error creating table
                console.error(err);
            }
        })
}

function createTimeRecordsTable(database) {
    database.run(`CREATE TABLE IF NOT EXISTS time_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        billable INTEGER NOT NULL DEFAULT 0,
        start_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        hours DECIMAL(4,2) GENERATED ALWAYS AS (ROUND(((JULIANDAY(end_ts) - JULIANDAY(start_ts)) * 24.0), 2)) STORED,
        adjustment DECIMAL(4,2) NOT NULL DEFAULT 0.00,
        invoice_activity TEXT,
        work_description TEXT,
        notes TEXT,
        project_id INTEGER NOT NULL,
        FOREIGN KEY (project_id)
            REFERENCES projects (id),
        CHECK (JULIANDAY(end_ts) >= JULIANDAY(start_ts))
    )`, (err) => {
        if (err) {
            // Error creating table
            console.error(err);
        }
    })
}


export function listenForQueries(database: sqlite3.Database) {

    ipcMain.handle(IpcChannel.GetClients, (event, ...args) => {
        const sql = 'SELECT * FROM clients ORDER BY client_name COLLATE NOCASE';

        return new Promise((resolve, reject) => {
            database.all(sql, (err, rows) => {
                if (!err) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            })
        })
    });

    ipcMain.handle(IpcChannel.CreateClient, (event, client) => {
        const keys = Object.keys(client).map(quoteValue);

        const values = Object.values(client).map(quoteValue);

        // TODO: This doesn't handle ' in the values (e.g. Bob's Burgers & Brew). Use something like knex so we aren't
        // building SQL strings through concatenation.
        const sql = `INSERT INTO clients (${keys.join()}) VALUES (${values.join()})`;

        return new Promise((resolve, reject) => {
            database.all(sql, (err, rows) => {
                if (!err) {
                    resolve(rows)
                } else {
                    reject(err);
                }
            })
        });
    });

    ipcMain.handle(IpcChannel.DeleteClient, (event, client) => {
        const sql = `DELETE FROM clients WHERE id=${client.id}`;
        return new Promise((resolve, reject) => {
            database.all(sql, (err, rows) => {
                if (!err) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            })
        })
    });
}

function quoteValue(val) {
    return typeof val === 'string' ? `'${val}'` : val;
}