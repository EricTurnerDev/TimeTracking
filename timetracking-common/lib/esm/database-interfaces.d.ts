export interface IDatabaseEntity {
    id?: number;
}
export interface IClient extends IDatabaseEntity {
    client_name?: string;
}
export interface IProject extends IDatabaseEntity {
    project_name?: string;
    client_id?: number;
}
export interface ITimeRecord extends IDatabaseEntity {
    billable?: 0 | 1;
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
    startTs?: string;
}
export interface IProjectsQuery {
    clientId?: number;
    projectId?: number;
}
