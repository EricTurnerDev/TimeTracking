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
import DataTable, {createTheme, TableColumn} from 'react-data-table-component';
import {Database} from 'timetracking-common';

import utcToLocal from '../../../lib/convertDateTimeUTCToLocal';
import {Icon, gear} from '../../ui/Icon';
import P from '../../ui/text/P';
import * as db from '../../../lib/database';

interface ITimekeepingDataTableProps {
    timeRecords: Database.IDetailedTimeRecord[];
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const TimekeepingDataTable = ({timeRecords, className}: ITimekeepingDataTableProps) => {

    const descriptionChanged = async (row: Database.IDetailedTimeRecord, description) => {
        await db.updateTimeRecord({id: row.id, description: description});
    };

    const columns: TableColumn<Database.IDetailedTimeRecord>[] = [
        {
            name: 'Description',
            selector: row => row.description,
            grow: 2,
            cell: row => <P editable={true} onSave={async (text) => descriptionChanged(row, text)} autoFocus={true}>{row.description}</P>
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
            cell: (row) => <MenuIcon row={row}/>,
            ignoreRowClick: true,
            width: '3rem'
        }
    ];

    return (
        <DataTable
            className={classNames(className)}
            columns={columns}
            data={timeRecords}
            theme='timetrackingDark'
            highlightOnHover
        />
    )
};

export default TimekeepingDataTable;

interface IMenuIconProps {
    row: Database.IDetailedTimeRecord;
}

const MenuIcon = ({row}: IMenuIconProps) => {
    const clicked = (e) => {
        console.log(row.id);
    };

    return (
        <span className='hover:cursor-pointer'>
            <Icon onClick={clicked} icon={gear}/>
        </span>
    )
};

// TODO: When gear icon is clicked, show a context menu with the ability to delete the record.

const Menu = () => {
    return (
        <div></div>
    )
}