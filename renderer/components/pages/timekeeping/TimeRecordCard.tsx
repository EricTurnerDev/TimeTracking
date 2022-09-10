/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {Database} from 'timetracking-common';
import classNames from 'classnames';
import Link from 'next/link';

import H2 from '../../ui/text/H2';
import P from '../../ui/text/P';
import Card from '../../ui/Card';
import {deleteTimeRecord} from "../../../lib/database";
import {Icon, trash} from '../../ui/Icon';
import utcToLocal from '../../../lib/convertDateTimeUTCToLocal';

interface ITimeRecordRowProps {
    className?: string;
    timeRecord?: Database.IDetailedTimeRecord;
    onTimeRecordDeleted?: () => void;
}

const styles = {
    base: 'flex flex-col mb-4'
};

export default function TimeRecordCard({timeRecord, onTimeRecordDeleted, className}: ITimeRecordRowProps) {
    const {adjustment, billable, client_name, end_ts, hours, invoice_activity, project_name, start_ts, work_description} = timeRecord;

    const trashIconClicked = (e) => {
        deleteTimeRecord(timeRecord.id)
            .then(() => {
                if (onTimeRecordDeleted) {
                    onTimeRecordDeleted();
                }
            })
            .catch(err => console.error(err));

    };

    const formatAdjustment = (adj) => {
        if (adj > 0 || adj < 0) {
            const sign = adj > 0 ? '+' : '';
            return `${sign}${adj.toFixed(2)} hours`
        } else {
            return '';
        }
    }

    return (
        <Card className={classNames('time-record-row', styles.base, className)}>
            <Card.Header>
                <Link href={{pathname: '/time-record', query: {id: timeRecord.id}}}>
                    <a className='block'>
                        <H2><strong>{work_description}</strong></H2>
                        <P>{client_name}{project_name && ` - ${project_name}`}</P>
                    </a>
                </Link>
            </Card.Header>
            <Card.Body>
                <P className='font-medium' variant='dark'>{invoice_activity}</P>
                <P variant='dark'>{utcToLocal(start_ts)} to {utcToLocal(end_ts)} {formatAdjustment(adjustment)}</P>
                <P variant='dark'>{hours} hours{billable ? ' (billable)' : ' (non-billable)'}</P>
            </Card.Body>
            <Card.Footer>
                <P variant='dark'>
                    <Icon icon={trash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
                </P>
            </Card.Footer>
        </Card>
    )
}