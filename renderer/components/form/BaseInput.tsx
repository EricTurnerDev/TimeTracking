import classNames from 'classnames';
import {useId} from 'react';
import BaseLabel from './BaseLabel';

const styles = {
    base: 'form-control border-transparent flex-1 appearance-none border w-full py-2 px-4 bg-white text-gray-700 shadow-sm text-base focus:outline-none focus:ring-2 focus:border-transparent',
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
}

interface IBaseInputProps {
    label?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'search' | 'tel' | 'checkbox' | 'radio';
    error?: boolean;
    required?: boolean;
    disabled?: boolean;
    valid?: boolean;
    className?: string;
    errorText?: string;
    rounded?: 'none' | 'default' | 'sm' | 'md' | 'lg';

    [x: string]: any;
}

const BaseInput = ({
                       label,
                       type = 'text',
                       error = false,
                       required = false,
                       disabled = false,
                       valid = false,
                       className = '',
                       errorText = '',
                       rounded = 'default',
                       ...rest
                   }: IBaseInputProps) => {

    const id = useId();

    return (
        <div className={classNames('base-input', className)}>
            {label && (<BaseLabel id={id}>{label} {required && '*'}</BaseLabel>)}
            <input
                id={id}
                type={type}
                className={classNames(
                    styles.base,
                    rounded && styles.rounded[rounded],
                    error ? styles.state.error : styles.state.normal,
                    valid ? styles.state.valid : styles.state.normal,
                    disabled && styles.state.disabled
                )}
                disabled={disabled}
                required={required}
                {...rest}
            />
            {error && <p className={classNames('base-input-error', styles.errorText)}>{errorText}</p>}
        </div>
    )
}

export default BaseInput;