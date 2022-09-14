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
import DataTable, {createTheme, TableColumn} from 'react-data-table-component';
import {Database} from 'timetracking-common';

import utcToLocal from '../../../lib/convertDateTimeUTCToLocal';
import * as db from '../../../lib/database';
import {RowActions} from '../DataTableRowActions';
import SubtleTextInput from "../../ui/form/SubtleTextInput";
import SubtleSelect from "../../ui/form/SubtleSelect";
import SelectOption from '../../../lib/types/SelectOption';
import NonEmptyArray from '../../../lib/types/NonEmptyArray';

interface ITimekeepingDataTableProps {
    timeRecords: Database.IDetailedTimeRecord[];
    onDelete?: () => any;
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const TimekeepingDataTable = ({timeRecords, onDelete, className}: ITimekeepingDataTableProps) => {

    const [clients, setClients] = useState<Database.IClient[]>([]);
    const [clientOptions, setClientOptions] = useState<NonEmptyArray<SelectOption>>([{value: '', text: ''}]);
    const [data, setData] = useState<Database.IDetailedTimeRecord[]>(timeRecords);

    useEffect(() => {
        db.getClients()
            .then((cls:Database.IClient[]) => setClients(cls))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setData(timeRecords);
    }, [timeRecords])

    useEffect(() => {
        const options:SelectOption[] = clients.map(client => ({value: client.id.toString(), text: client.client_name}));
        setClientOptions([{value: '', text: ''}, ...options]);
    }, [clients])

    const descriptionChanged = async (row: Database.IDetailedTimeRecord, description) => {
        await db.updateTimeRecord({id: row.id, description: description});
    };

    const clientChanged = async (row, option:SelectOption) => {
        await db.updateTimeRecord({id: row.id, client_id: parseInt(option.value), project_id: null});

        // Since the project has been cleared, re-fetch the detailed time records and update the data that the data table is using.
        const updatedTimeRecords = await db.getDetailedTimeRecords({});
        setData(updatedTimeRecords);
    };

    const columns: TableColumn<Database.IDetailedTimeRecord>[] = [
        {
            name: 'Description',
            selector: row => row.description,
            grow: 2,
            cell: row => <SubtleTextInput onSave={async (text) => descriptionChanged(row, text)} autoFocus={true}>{row.description}</SubtleTextInput>
        },
        {
            name: 'Client',
            selector: row => row.client_name,
            grow: 1,
            cell: row => <SubtleSelect options={clientOptions}
                                       value={row.client_id.toString()}
                                       selectionChanged={async (option:SelectOption) => clientChanged(row, option)}/>
        },
        {
            name: 'Project',
            selector: row => row.project_name,
            grow: 1,
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
            cell: (row) => <RowActions row={row} deleteRow={(rowId) => db.deleteTimeRecord(rowId)} onDelete={onDelete}/>,
            ignoreRowClick: true,
            width: '3rem'
        }
    ];

    return (
        <DataTable
            className={classNames(className)}
            columns={columns}
            data={data}
            theme='timetrackingDark'
            highlightOnHover
        />
    )
};

export default TimekeepingDataTable;


