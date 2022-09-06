import BaseInput, {IBaseInput} from './BaseInput';

interface IHiddenInput extends IBaseInput {}

const HiddenInput = ({...props}: IHiddenInput) => {
    return (
        <BaseInput type='hidden' className='hidden-input' {...props} />
    )
};

export default HiddenInput;

