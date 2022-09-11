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
import {useLayoutEffect, useEffect, useRef, useState} from 'react';
import DataTable, {createTheme, TableColumn} from 'react-data-table-component';
import {Database} from 'timetracking-common';

import utcToLocal from '../../../lib/convertDateTimeUTCToLocal';
import {Icon, gear, trash} from '../../ui/Icon';
import P from '../../ui/text/P';
import * as db from '../../../lib/database';

interface ITimekeepingDataTableProps {
    timeRecords: Database.IDetailedTimeRecord[];
    onDelete?: () => any;
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const TimekeepingDataTable = ({timeRecords, onDelete, className}: ITimekeepingDataTableProps) => {

    const descriptionChanged = async (row: Database.IDetailedTimeRecord, description) => {
        await db.updateTimeRecord({id: row.id, description: description});
    };

    const columns: TableColumn<Database.IDetailedTimeRecord>[] = [
        {
            name: 'Description',
            selector: row => row.description,
            grow: 2,
            cell: row => <P editable={true} onSave={async (text) => descriptionChanged(row, text)}
                            autoFocus={true}>{row.description}</P>
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
            cell: (row) => <RecordActions record={row} onDelete={onDelete}/>,
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
    record: Database.IDetailedTimeRecord;
    onDelete: () => any;
}

const RecordActions = ({record, onDelete}: IMenuIconProps) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupLocation, setPopupLocation] = useState({x: 0, y: 0});
    const [popupWidth, setPopupWidth] = useState(0);
    const popupRef = useRef(null);

    const hide = () => {
        setPopupVisible(false);
    };

    useLayoutEffect(() => {
        setPopupWidth(popupRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        if (popupVisible) {
            popupRef.current.focus();
        }
    }, [popupVisible]);

    const iconClicked = (e) => {
        setPopupLocation({x: e.clientX, y: e.clientY});
        setPopupVisible(visible => !visible);
    };

    return (
        <div className='record-actions z-50' onBlur={hide} tabIndex={-1}>
            <Icon icon={gear} className='hover:cursor-pointer' onMouseDown={iconClicked}/>

            <div
                className={classNames(
                    'actions-popup',
                    'fixed bg-gray-600 text-gray-50 rounded',
                    popupVisible ? 'visible' : 'invisible'
                )}
                ref={popupRef}
                style={{top: popupLocation.y + 10, left: popupLocation.x - popupWidth - 10}}>
                <div>
                    <DeleteRecordAction record={record} onDelete={onDelete} onClose={hide}/>
                </div>
            </div>

        </div>
    )
};

const DeleteRecordAction = ({record, onDelete, onClose}) => {
    const deleteRecord = () => {
        db.deleteTimeRecord(record.id)
            .then(() => {
                if (onDelete) {
                    onDelete();
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (onClose) {
                    onClose();
                }
            });
    };

    return (
        <div className='delete-record-action block p-4 hover:cursor-pointer hover:bg-black' onClick={deleteRecord}>
            <Icon icon={trash} className='mr-2'/> Delete
        </div>
    )
};
