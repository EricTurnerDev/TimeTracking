import {Database} from 'timetracking-common';
import classNames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {DateTime} from 'luxon';

import H2 from '../components/ui/text/H2';
import P from '../components/ui/text/P';
import Card from '../components/ui/Card';
import {deleteTimeRecord} from "../lib/database";

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

    const isoUTCToLocal = (utc:string) => {
        return DateTime.fromISO(utc).toLocaleString(DateTime.DATETIME_MED);
    }

    return (
        <Card className={classNames('time-record-row', styles.base, className)}>
            <Card.Header>
                <div>
                    <H2><strong>{work_description}</strong></H2>
                    <P>{client_name}{project_name && ` - ${project_name}`}</P>
                </div>
            </Card.Header>
            <Card.Body>
                <P className='font-medium' variant='dark'>{invoice_activity}</P>
                <P variant='dark'>{isoUTCToLocal(start_ts)} to {isoUTCToLocal(end_ts)} {adjustment !== 0.0 && `${adjustment > 0 ? '+' : ''}${adjustment} hours`}</P>
                <P variant='dark'>{hours} hours{billable ? ' (billable)' : ' (non-billable)'}</P>
            </Card.Body>
            <Card.Footer>
                <P variant='dark'>
                    <FontAwesomeIcon icon={faTrash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
                </P>
            </Card.Footer>
        </Card>
    )
}