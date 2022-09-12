/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface IDatabaseEntity {
    id?: number;
}

export interface IClient extends IDatabaseEntity {
    client_name?: string;
}

export interface IProject extends IDatabaseEntity {
    project_name?: string,
    client_id?: number;
}

export interface ITimeRecord extends IDatabaseEntity {
    billable?: boolean|number;
    start_ts?: string;
    end_ts?: string;
    adjustment?: number;
    description?: string;
    notes?: string;
    client_id?: number;
    project_id?: number;
}

export interface IDetailedTimeRecord extends ITimeRecord {
    hours?: number;
    project_name?: string;
    client_name?: string;
}

export interface ITimeRecordsQuery {
    clientId?: number;
    projectId?: number;
}