import classNames from 'classnames';
import {useField} from 'formik';
import {useId} from 'react';

import Label from './Label';
import P from "../text/P";

interface IDateTimeInputProps {
    id?: string;
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const DateTimeInput = ({id, label, required, disabled, className, ...props}: IDateTimeInputProps) => {

    const styles = {
        base: 'appearance-none border bg-white text-gray-700 shadow-md text-base focus:outline-none focus:ring-2 focus:border-transparent',
        state: {
            normal: 'placeholder-gray-400 border-gray-300 focus:ring-purple-600',
            error: 'border-red-600 focus:ring-red-600 text-red-600',
            valid: 'border-green-600 focus:ring-green-600',
            disabled: 'cursor-not-allowed bg-gray-100 shadow-inner text-gray-400',
        },
        errorText: 'mt-2 text-sm text-red-600',
    };

    const [field, meta] = useField(props);
    const inputId = useId();

    return (
        <div className={classNames('datetime-input', className)}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <input
                id={inputId}
                className={classNames(
                    styles.base,
                    meta.touched && meta.error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled
                )}
                required={required}
                type='datetime-local'
                {...field}
                {...props} />

            {meta.touched && meta.error ? (<P className={classNames('error', styles.errorText)}>{meta.error}</P>) : null}

        </div>
    )
};

export default DateTimeInput;