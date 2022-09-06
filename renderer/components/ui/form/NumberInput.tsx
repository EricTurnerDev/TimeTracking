import BaseInput, {IBaseInput} from './BaseInput';
import classNames from 'classnames';

interface INumberInput extends IBaseInput {
    step?: string;
}

const NumberInput = ({className, ...props}: INumberInput) => {
    return (
        <BaseInput type='number' className={classNames('number-input', className)} {...props} />
    )
};

export default NumberInput;