import BaseInput, {IBaseInput} from './BaseInput';
import classNames from 'classnames';

interface ICheckboxInput extends IBaseInput {}

const CheckboxInput = ({className, ...props}: ICheckboxInput) => {
    return (
        <BaseInput type='checkbox' className={classNames('checkbox-input', className)} inputStyles='p-0' {...props} />
    )
};

export default CheckboxInput;

