/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {ReactNode,useId} from 'react';
import {useField} from 'formik';

import Label from './Label';
import P from '../text/P';

interface ISelectInputProps {
    id?: string;
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
}

const SelectInput = ({id, label, required, disabled, className, children, ...props}: ISelectInputProps) => {

    const styles = {
        base: 'text-gray-700 w-full',
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
        <div className={classNames('select-input', className)} id={id}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <select
                className={classNames(
                    styles.base,
                    meta.touched && meta.error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled
                )}
                id={inputId}
                {...field}
                {...props}>
                {children}
            </select>

            {meta.touched && meta.error ? (<P className={classNames('error', styles.errorText)}>{meta.error}</P>) : null}
        </div>
    )
};

export default SelectInput;