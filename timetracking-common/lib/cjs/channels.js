"use strict";
/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportSpreadsheet = exports.UploadDatabaseFile = exports.DownloadDatabaseFile = exports.GetActivitySummaryValues = exports.GetActivityMapValues = exports.GetDetailedTimeRecords = exports.GetTimeRecords = exports.UpdateTimeRecord = exports.DeleteTimeRecord = exports.GetDetailedTimeRecord = exports.GetTimeRecord = exports.CreateTimeRecord = exports.GetProjects = exports.UpdateProject = exports.DeleteProject = exports.GetProject = exports.CreateProject = exports.GetClients = exports.UpdateClient = exports.DeleteClient = exports.GetClient = exports.CreateClient = void 0;
exports.CreateClient = "client:create";
exports.GetClient = 'client:get';
exports.DeleteClient = 'client:delete';
exports.UpdateClient = 'client:update';
exports.GetClients = 'clients:get';
exports.CreateProject = 'project:create';
exports.GetProject = 'project:get';
exports.DeleteProject = 'project:delete';
exports.UpdateProject = 'project:update';
exports.GetProjects = 'projects:get';
exports.CreateTimeRecord = 'time-record:create';
exports.GetTimeRecord = 'time-record: get';
exports.GetDetailedTimeRecord = 'time-record:detailed:get';
exports.DeleteTimeRecord = 'time-record:delete';
exports.UpdateTimeRecord = 'time-record:update';
exports.GetTimeRecords = 'time-records:get';
exports.GetDetailedTimeRecords = 'time-records:detailed:get';
exports.GetActivityMapValues = 'activity-map:values:get';
exports.GetActivitySummaryValues = 'activity-summary:values:get';
exports.DownloadDatabaseFile = 'database:file:download';
exports.UploadDatabaseFile = 'database:file:upload';
exports.ExportSpreadsheet = 'spreadsheet:export';
