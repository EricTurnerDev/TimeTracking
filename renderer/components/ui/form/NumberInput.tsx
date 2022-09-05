import classNames from 'classnames';
import {useField} from 'formik';
import {useId} from 'react';

import Label from './Label';
import P from '../text/P';

interface INumberInput {
    id?: string;
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    step?: string;
}

const NumberInput = ({id, label, required, disabled, className, ...props}: INumberInput) => {

    const styles = {
        base: 'appearance-none border bg-white text-gray-700 shadow-md text-base focus:outline-none focus:ring-2 focus:border-transparent w-full py-2 px-4',
        state: {
            normal: 'placeholder-gray-400 border-gray-300 focus:ring-purple-600',
            error: 'border-red-600 focus:ring-red-600 text-red-600',
            valid: 'border-green-600 focus:ring-green-600',
            disabled: 'cursor-not-allowed bg-gray-100 shadow-inner text-gray-400',
        },
        rounded: {
            none: null,
            default: 'rounded',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
        },
        errorText: 'mt-2 text-sm text-red-600',
    };

    const [field, meta] = useField(props);
    const inputId = useId();

    return (
        <div className={classNames('number-input', className)} id={id}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <input
                className={classNames(
                    styles.base,
                    meta.touched && meta.error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled
                )}
                type='number'
                id={inputId}
                {...field}
                {...props}
            />

            {meta.touched && meta.error ? (<P className={classNames('error', styles.errorText)}>{meta.error}</P>) : null}
        </div>
    )
};

export default NumberInput;

