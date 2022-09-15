/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {darkTheme} from '../../../lib/dataTableThemes';

import classNames from 'classnames';
import {useEffect, useState} from 'react';
import DataTable, {createTheme} from 'react-data-table-component';
import {Database} from 'timetracking-common';

import utcToLocal from '../../../lib/convertDateTimeUTCToLocal';
import * as db from '../../../lib/database';
import {RowActions} from '../DataTableRowActions';
import SubtleTextInput from "../../ui/form/SubtleTextInput";
import SubtleSelect from "../../ui/form/SubtleSelect";
import SelectOption from '../../../lib/types/SelectOption';

interface ITimekeepingDataTableProps {
    timeRecords: Database.IDetailedTimeRecord[];
    onDelete?: () => any;
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const emptyOption: SelectOption = {value: '', text: ''};

const TimekeepingDataTable = ({timeRecords, onDelete, className}: ITimekeepingDataTableProps) => {

    interface IDataTableRecord extends Database.IDetailedTimeRecord {
        projectOptions: SelectOption[];
    }

    const [tableData, setTableData] = useState<IDataTableRecord[]>([]);
    const [columns, setColumns] = useState([]);
    const [pending, setPending] = useState<boolean>(true);
    const [projectSelectOptions, setProjectSelectOptions] = useState<{[clientId:number]: SelectOption[]}>([]);

    const createTableData = (timeRecords:Database.IDetailedTimeRecord[], projectSelectOptions): IDataTableRecord[] => {
        return timeRecords.map(tr => {
            const opts = projectSelectOptions[tr.client_id] || [];
            return {...tr, projectOptions: [emptyOption, ...opts]}
        });
    };

    useEffect(() => {
        Promise.all([db.getClients(), db.getProjects({})])
            .then(([clients, projects]) => {
                const clientSelectOptions = clients.map(client => ({value: client.id.toString(), text: client.client_name}));

                const projectSelectOptions = {};
                clients.forEach(client => {
                    const clientProjects = projects.filter(project => project.client_id === client.id);
                    projectSelectOptions[client.id] = clientProjects.map(project => ({value: project.id.toString(), text: project.project_name}));
                });

                setProjectSelectOptions(projectSelectOptions);

                setTableData(createTableData(timeRecords, projectSelectOptions));

                setColumns([
                    {
                        name: 'Description',
                        selector: row => row.description,
                        grow: 2,
                        cell: row => <SubtleTextInput onSave={async (text) => descriptionChanged(row, text)}
                                                      autoFocus={true}>{row.description}</SubtleTextInput>
                    },
                    {
                        name: 'Client',
                        selector: row => row.client_name,
                        grow: 1,
                        cell: row => <SubtleSelect options={[emptyOption, ...clientSelectOptions]}
                                                   value={row.client_id.toString()}
                                                   allowBlank={false}
                                                   selectionChanged={async (option: SelectOption) => clientChanged(row, option)}/>
                    },
                    {
                        name: 'Project',
                        selector: row => row.project_name,
                        grow: 1,
                        cell: row => <SubtleSelect options={row.projectOptions}
                                                   value={row.project_id?.toString()}
                                                   selectionChanged={async (option: SelectOption) => projectChanged(row, option)}/>
                    },
                    {
                        name: 'Billable',
                        selector: row => row.billable,
                        format: row => row.billable ? '$' : '',
                        width: '5rem',
                        center: true,
                    },
                    {
                        name: 'Start',
                        selector: row => row.start_ts,
                        format: row => utcToLocal(row.start_ts),
                        width: '10rem'
                    },
                    {
                        name: 'End',
                        selector: row => row.end_ts,
                        format: row => utcToLocal(row.end_ts),
                        width: '10rem'
                    },
                    {
                        name: 'Hours',
                        selector: row => row.hours,
                        format: row => row.hours.toFixed(2),
                        width: '5rem'
                    },
                    {
                        name: '',
                        sortable: false,
                        cell: (row) => <RowActions row={row}
                                                   deleteRow={timeRecordDeleted}
                                                   onDelete={onDelete}/>,
                        ignoreRowClick: true,
                        width: '3rem'
                    }
                ]);
                setPending(false);
            })
            .catch(err => console.error(err));
    }, [timeRecords]);

    const descriptionChanged = async (row: Database.IDetailedTimeRecord, description) => {
        await db.updateTimeRecord({id: row.id, description: description});
    };

    const clientChanged = async (row, option: SelectOption) => {
        await db.updateTimeRecord({id: row.id, client_id: parseInt(option.value), project_id: null});
        await refreshTableData();
    };

    const projectChanged = async (row, option: SelectOption) => {
        await db.updateTimeRecord({id: row.id, project_id: parseInt(option.value)});
    };

    const timeRecordDeleted = async (timeRecordId:number) => {
        await db.deleteTimeRecord(timeRecordId);
        await refreshTableData();
    }

    const refreshTableData = async () => {
        setPending(true);
        const updatedTimeRecords = await db.getDetailedTimeRecords({});
        setTableData(createTableData(updatedTimeRecords, projectSelectOptions));
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


