import BaseInput, {IBaseInput} from './BaseInput';
import classNames from 'classnames';

interface IDateTimeInputProps extends IBaseInput {}

const DateTimeInput = ({className, ...props}: IDateTimeInputProps) => {
    return (
        <BaseInput type='datetime-local' className={classNames('datetime-input', className)} {...props} />
    )
};

export default DateTimeInput;