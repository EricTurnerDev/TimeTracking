import classNames from 'classnames';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import {Database} from 'timetracking-common';

import {getDetailedTimeRecords} from '../lib/database';
import TimeRecordCard from '../components/TimeRecordCard';
import Button from '../components/ui/Button';
import AddTimeRecordForm from '../components/AddTimeRecordForm';
import {Icon, plus} from '../components/ui/Icon';

export default function Timekeeping() {
    const [timeRecords, setTimeRecords] = useState<Database.IDetailedTimeRecord[]>();
    const [addingTimeRecord, setAddingTimeRecord] = useState<boolean>(false);

    const showTimeRecords = async () => {
        const trs: Database.IDetailedTimeRecord[] = await getDetailedTimeRecords({});
        setTimeRecords(trs);
    }

    useEffect(() => {
       showTimeRecords().catch(err => console.log(err));
    }, []);

    const addTimeRecordButtonClicked = () => {
        setAddingTimeRecord(true);
    };

    const timeRecordAdded = () => {
        setAddingTimeRecord(false);
        showTimeRecords().catch(err => console.error(err));
    }

    const timeRecordDeleted = () => {
        showTimeRecords().catch(err => console.error(err));
    }

    const addingTimeRecordCanceled = () => {
        setAddingTimeRecord(false);
    }

    return (
        <div className={classNames('timekeeping')}>
            <Head>
                <title>Timekeeping - TimeTracking</title>
            </Head>

            <div className='mb-4 text-right'>
                <Button onClick={addTimeRecordButtonClicked} disabled={addingTimeRecord}>
                    <Icon icon={plus} /> New Time Record
                </Button>
            </div>

            {addingTimeRecord && <AddTimeRecordForm className='mb-4' onTimeRecordAdded={timeRecordAdded} onCancel={addingTimeRecordCanceled}/>}

            <div>
                {
                    timeRecords && timeRecords.map(
                        (timeRecord: Database.IDetailedTimeRecord) => {
                            return <TimeRecordCard key={timeRecord.id} timeRecord={timeRecord} onTimeRecordDeleted={timeRecordDeleted} />
                        }
                    )
                }
            </div>
        </div>
    )
}