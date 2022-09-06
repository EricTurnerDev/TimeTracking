import BaseInput, {IBaseInput} from './BaseInput';
import classNames from 'classnames';

interface ITextInput extends IBaseInput {
    placeholder?: string;
}

const TextInput = ({className, ...props}: ITextInput) => {
    return (
        <BaseInput type='text' className={classNames('text-input', className)} {...props} />
    )
};

export default TextInput;

