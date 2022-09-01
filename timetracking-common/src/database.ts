export interface IClient {
    id?: number;
    client_name?: string;
}

export interface IProject {
    id?: number;
    project_name?: string,
    client_id?: number;
}

export interface ITimeRecord {
    id?: number;
    billable?: boolean;
    start_ts?: string;
    end_ts?: string;
    adjustment?: number;
    invoice_activity?: string;
    work_description?: string;
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