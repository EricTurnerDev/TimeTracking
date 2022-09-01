import classNames from 'classnames';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import {Database} from 'timetracking-common';
import {getDetailedTimeRecords} from '../lib/database';

export default function Timekeeping() {
    const [timeRecords, setTimeRecords] = useState<Database.IDetailedTimeRecord[]>();

    useEffect(() => {
        getDetailedTimeRecords({})
            .then((trs: Database.IDetailedTimeRecord[]) => {
                console.log(trs);
                setTimeRecords(trs);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={classNames('timekeeping')}>
            <Head>
                <title>Timekeeping - TimeTracking</title>
            </Head>

            {timeRecords && timeRecords.map((timeRecord: Database.IDetailedTimeRecord) => (<p key={timeRecord.id}>{timeRecord.invoice_activity}: {timeRecord.work_description}</p>))}
        </div>
    )
}