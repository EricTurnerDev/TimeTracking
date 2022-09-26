/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {darkTheme} from '@/lib/dataTableThemes';

import classNames from 'classnames';
import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';
import DataTable, {createTheme} from 'react-data-table-component';
import {DatabaseInterfaces} from 'timetracking-common';

import {localISOToUTCISO} from '@/lib/dateTimeConversion';
import * as db from '@/lib/database';
import {RowActions} from '@/components/pages/DataTableRowActions';
import InlineEditDateTime from '@/components/ui/inline-editing/InlineEditDateTime';
import InlineEditSelect from '@/components/ui/inline-editing/InlineEditSelect';
import InlineEditText from '@/components/ui/inline-editing/InlineEditText';
import SelectOption from '@/lib/types/SelectOption';
import InlineEditToggle from "@/components/ui/inline-editing/InlineEditToggle";

interface ITimekeepingDataTableProps {
    timeRecords: DatabaseInterfaces.IDetailedTimeRecord[];
    onDelete?: () => any;
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const emptyOption: SelectOption = {value: '', text: ''};

const TimekeepingDataTable = ({timeRecords, onDelete, className}: ITimekeepingDataTableProps) => {

    interface IDataTableRecord extends DatabaseInterfaces.IDetailedTimeRecord {
        projectOptions: SelectOption[];
    }

    const [tableData, setTableData] = useState<IDataTableRecord[]>([]);
    const [columns, setColumns] = useState([]);
    const [pending, setPending] = useState<boolean>(true);

    const createTableData = async (timeRecords: DatabaseInterfaces.IDetailedTimeRecord[]): Promise<IDataTableRecord[]> => {
        const allProjects: DatabaseInterfaces.IProject[] = await db.getProjects({});

        return timeRecords.map(tr => {
            const projects = allProjects.filter(project => project.client_id === tr.client_id) || [];
            const opts = createProjectSelectOptions(projects) || [];
            return {...tr, projectOptions: [emptyOption, ...opts]}
        });
    };

    const createClientSelectOptions = (clients: DatabaseInterfaces.IClient[]) => {
        return clients.map(client => ({
            value: client.id.toString(),
            text: client.client_name
        }));
    }

    const createProjectSelectOptions = (projects: DatabaseInterfaces.IProject[]) => {
        return projects.map(project => ({
            value: project.id.toString(),
            text: project.project_name
        }));
    };

    useEffect(() => {
        const updateState = async () => {
            const clients = await db.getClients();
            const clientSelectOptions = createClientSelectOptions(clients);
            const td = await createTableData(timeRecords);
            setTableData(td);

            setColumns([
                {
                    name: 'Description',
                    selector: row => row.description,
                    grow: 2,
                    cell: row => <InlineEditText onSave={async (text) => descriptionChanged(row, text)}
                                                 autoFocus={true}>{row.description}</InlineEditText>
                },
                {
                    name: 'Client',
                    selector: row => row.client_name,
                    grow: 1,
                    cell: row => <InlineEditSelect options={[emptyOption, ...clientSelectOptions]}
                                                   value={row.client_id.toString()}
                                                   allowBlank={false}
                                                   autoFocus={true}
                                                   selectionChanged={async (option: SelectOption) => clientChanged(row, option)}/>
                },
                {
                    name: 'Project',
                    selector: row => row.project_name,
                    grow: 1,
                    cell: row => <InlineEditSelect options={row.projectOptions}
                                                   value={row.project_id?.toString()}
                                                   autoFocus={true}
                                                   selectionChanged={async (option: SelectOption) => projectChanged(row, option)}/>
                },
                {
                    name: 'Billable',
                    selector: row => row.billable,
                    width: '5rem',
                    center: true,
                    cell: row => <InlineEditToggle value={row.billable}
                                                   onSave={async (billable) => billableChanged(row, billable)}
                                                   formatter={(v) => v ? '$' : ' '}
                                                   autoFocus={true}/>
                },
                {
                    name: 'Start',
                    selector: row => row.start_ts,
                    width: '10rem',
                    cell: row => <InlineEditDateTime className='z-50'
                                                     onSave={async (localISODateTime: string) => startDateTimeChanged(row, localISODateTime)}
                                                     autoFocus={true}>{row.start_ts}</InlineEditDateTime>
                },
                {
                    name: 'End',
                    selector: row => row.end_ts,
                    width: '10rem',
                    cell: row => <InlineEditDateTime className='z-40'
                                                     onSave={async (localISODateTime: string) => endDateTimeChanged(row, localISODateTime)}
                                                     autoFocus={true}>{row.end_ts || ''}</InlineEditDateTime>
                },
                {
                    name: 'Hours',
                    selector: row => row.hours,
                    format: row => row.hours?.toFixed(2),
                    width: '5rem'
                },
                {
                    name: '',
                    sortable: false,
                    cell: (row) => <RowActions row={row}
                                               deleteRow={timeRecordDeleted}
                                               onDelete={onDelete}
                                               cloneRow={timeRecordCloned}
                                               onClone={() => console.log(`Clone completed`)}/>,
                    ignoreRowClick: true,
                    width: '3rem'
                }
            ]);
            setPending(false);
        };

        updateState().catch(err => console.error(err));
    }, [timeRecords]);

    const descriptionChanged = async (row: DatabaseInterfaces.IDetailedTimeRecord, description) => {
        await db.updateTimeRecord({id: row.id, description: description});
        await refreshTableData();
    };

    const clientChanged = async (row, option: SelectOption) => {
        await db.updateTimeRecord({id: row.id, client_id: parseInt(option.value), project_id: null});
        await refreshTableData();
    };

    const projectChanged = async (row, option: SelectOption) => {
        await db.updateTimeRecord({id: row.id, project_id: parseInt(option.value)});
        await refreshTableData();
    };

    const startDateTimeChanged = async (row, localISODateTime) => {
        await db.updateTimeRecord({id: row.id, start_ts: localISOToUTCISO(localISODateTime)});
        await refreshTableData();
    }

    const endDateTimeChanged = async (row, localISODateTime) => {
        await db.updateTimeRecord({id: row.id, end_ts: localISOToUTCISO(localISODateTime)});
        await refreshTableData();
    }

    const billableChanged = async (row, billable) => {
        await db.updateTimeRecord({id: row.id, billable});
        await refreshTableData();
    }

    const timeRecordCloned = async (timeRecordId: number) => {
        // Find the time record in tableData by the timeRecordId
        const timeRecord = timeRecords.find(record => {
            return record.id === timeRecordId;
        });

        if (timeRecord) {
            // Create a new time record from the existing one
            const record: DatabaseInterfaces.ITimeRecord = (({description, client_id, project_id, billable}) => ({
                description,
                client_id,
                project_id,
                billable,
                start_ts: DateTime.utc().toISO(),
            }))(timeRecord);

            await db.createTimeRecord(record)

            await refreshTableData();
        } else {
            throw new Error(`Unable to find time record ${timeRecordId} to clone it`);
        }
    };

    const timeRecordDeleted = async (timeRecordId: number) => {
        await db.deleteTimeRecord(timeRecordId);
        await refreshTableData();
    }

    const refreshTableData = async () => {
        setPending(true);
        const updatedTimeRecords = await db.getDetailedTimeRecords({});
        const td = await createTableData(updatedTimeRecords);
        setTableData(td);
        setPending(false);
    };

    return (
        <DataTable
            className={classNames(className)}
            columns={columns}
            data={tableData}
            theme='timetrackingDark'
            progressPending={pending}
            highlightOnHover
        />
    )
};

export default TimekeepingDataTable;


