import {Database} from 'timetracking-common';
import classNames from 'classnames';

interface ITimeRecordRowProps {
    className?: string;
    timeRecord?: Database.IDetailedTimeRecord;
}

const styles = {
    base: 'flex flex-row'
};

export default function TimeRecordRow({timeRecord, className}: ITimeRecordRowProps) {
    return (
        <div className={classNames('time-record-row', styles.base, className)}>

        </div>
    )
}