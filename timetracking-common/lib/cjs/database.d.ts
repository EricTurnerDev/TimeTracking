export interface IClientsTable {
    id?: number;
    client_name?: string;
}
export interface IProjectsTable {
    id?: number;
    project_name?: string;
    client_id?: number;
}
export interface ITimeRecordsTable {
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
export interface ITimeRecordsQuery {
    clientId?: number;
    projectId?: number;
}
