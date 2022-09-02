import classNames from 'classnames';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import {Database} from 'timetracking-common';

import {getDetailedTimeRecords} from '../lib/database';
import TimeRecordCard from '../components/TimeRecordCard';

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

            <div>
                {
                    timeRecords && timeRecords.map(
                        (timeRecord: Database.IDetailedTimeRecord) => {
                            return <TimeRecordCard key={timeRecord.id} timeRecord={timeRecord}/>
                        }
                    )
                }
            </div>
        </div>
    )
}