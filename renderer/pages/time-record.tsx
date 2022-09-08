/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

import {parseIntQueryParam} from '../lib/parseQueryParam';
import {Database} from 'timetracking-common';
import * as db from '../lib/database';
import utcToLocal from '../lib/convertDateTimeUTCToLocal';
import H1 from '../components/ui/text/H1';
import P from '../components/ui/text/P';
import Span from '../components/ui/text/Span';

const TimeRecord = ({}) => {
    const router = useRouter();
    const {id: timeRecordId} = router.query;
    const [timeRecord, setTimeRecord] = useState<Database.IDetailedTimeRecord>();

    // Get the time record
    useEffect(() => {
        if (timeRecordId) {
            const ids: number[] = parseIntQueryParam(timeRecordId);
            if (ids.length > 0) {
                db.getDetailedTimeRecord(ids[0])
                    .then((trec: Database.IDetailedTimeRecord) => {
                        setTimeRecord(trec);
                    })
                    .catch(err => {
                        console.error(err)
                    });
            }
        }
    }, [timeRecordId])

    return (
        <div className='time-record'>
            <Head>
                <title>Time Record - TimeKeeping</title>
            </Head>

            {timeRecord &&
                <div>
                    <H1 className='mb-2'>{timeRecord.invoice_activity}: {timeRecord.work_description}</H1>
                    <P className='mb-2 italic font-light'><Span>{utcToLocal(timeRecord.start_ts)}</Span> - <span>{utcToLocal(timeRecord.end_ts)}</span></P>
                    <P>Client: {timeRecord.client_name}</P>
                    {timeRecord.project_name && <P>Project: {timeRecord.project_name}</P>}
                    <P>Billable: {timeRecord.billable ? 'yes' : 'no'}</P>
                    {timeRecord.notes && <P className='mb-2'>Notes: {timeRecord.notes}</P>}
                </div>
            }
        </div>
    )
}

export default TimeRecord;