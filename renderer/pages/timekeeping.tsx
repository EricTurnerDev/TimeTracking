/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import {Database} from 'timetracking-common';

import AddTimeRecordForm from '@/components/pages/timekeeping/AddTimeRecordForm';
import Button from '@/components/ui/Button';
import {exportSpreadsheet, getDetailedTimeRecords} from '@/lib/database';
import {Icon, plus, spreadsheet} from '@/components/ui/Icon';
import TimekeepingDataTable from '@/components/pages/timekeeping/TimekeepingDataTable';

export default function Timekeeping() {
    const [timeRecords, setTimeRecords] = useState<Database.IDetailedTimeRecord[]>();
    const [addingTimeRecord, setAddingTimeRecord] = useState<boolean>(false);
    const [exportingTimeRecords, setExportingTimeRecords] = useState<boolean>(false);

    // Fetches time records from the database, and saves them in this component's state.
    const updateTimeRecords = async () => {
        const trs: Database.IDetailedTimeRecord[] = await getDetailedTimeRecords({});
        setTimeRecords(trs);
    }

    // Initializes this component's state with time records.
    useEffect(() => {
       updateTimeRecords().catch(err => console.log(err));
    }, []);

    const addTimeRecordButtonClicked = () => {
        // This will cause the form for adding time records to be shown.
        setAddingTimeRecord(true);
    };

    const exportTimeRecordsButtonClicked = () => {
        // TODO: Change this so shows a form that the user can use to filter records by date range, client, etc...
        // similar to how we show a form to add a new time record.
        setExportingTimeRecords(true);
        exportSpreadsheet({}).catch(err => console.error(err));
        setExportingTimeRecords(false);
    };

    const timeRecordAdded = () => {
        setAddingTimeRecord(false);
        updateTimeRecords().catch(err => console.error(err));
    }

    const timeRecordDeleted = () => {
        updateTimeRecords().catch(err => console.error(err));
    }

    const addingTimeRecordCanceled = () => {
        setAddingTimeRecord(false);
    }

    return (
        <div className={classNames('timekeeping')}>
            <Head>
                <title>Timekeeping - TimeTracking</title>
            </Head>

            <div className='flex flex-row justify-end mb-4'>
                <Button className='mr-2' onClick={addTimeRecordButtonClicked} disabled={addingTimeRecord}>
                    <Icon icon={plus} /> New Time Record
                </Button>

                <Button variant='secondary' onClick={exportTimeRecordsButtonClicked} disabled={exportingTimeRecords}>
                    <Icon icon={spreadsheet} /> Export Time Records
                </Button>
            </div>

            {addingTimeRecord && <AddTimeRecordForm className='mb-4' onTimeRecordAdded={timeRecordAdded} onCancel={addingTimeRecordCanceled}/>}

            {timeRecords && <TimekeepingDataTable timeRecords={timeRecords} onDelete={timeRecordDeleted} />}
        </div>
    )
}