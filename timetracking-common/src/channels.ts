/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const CreateClient: string = "client:create";
export const GetClient: string = 'client:get';
export const DeleteClient: string = 'client:delete';
export const UpdateClient: string = 'client:update';
export const GetClients: string = 'clients:get';

export const CreateProject: string = 'project:create';
export const GetProject: string = 'project:get';
export const DeleteProject: string = 'project:delete';
export const UpdateProject: string = 'project:update';
export const GetProjects: string = 'projects:get';

export const CreateTimeRecord: string = 'time-record:create';
export const GetTimeRecord: string = 'time-record: get';
export const GetDetailedTimeRecord: string = 'time-record:detailed:get';
export const DeleteTimeRecord: string = 'time-record:delete';
export const UpdateTimeRecord: string = 'time-record:update';
export const GetTimeRecords: string = 'time-records:get';
export const GetDetailedTimeRecords: string = 'time-records:detailed:get';

export const GetActivityMapValues: string = 'activity-map:values:get';
export const GetActivitySummaryValues: string = 'activity-summary:values:get';

export const DownloadDatabaseFile: string = 'database:file:download';
export const UploadDatabaseFile: string = 'database:file:upload';
export const ExportSpreadsheet: string = 'spreadsheet:export';

export const GetHours: string = 'hours:get';