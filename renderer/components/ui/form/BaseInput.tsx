/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {useField} from 'formik';
import {useId} from 'react';

import Label from './Label';
import P from '../text/P';

export interface IBaseInput {
    id?: string;
    type?: 'checkbox'|'datetime-local'|'hidden'|'number'|'text';
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    inputStyles?: string; // Additional styles applied directly to the <input> element
}

const BaseInput = ({id, type='text', label, required=false, disabled=false, className, inputStyles, ...props}: IBaseInput) => {

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
        <div className={classNames('base-input', className)} id={id}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <input
                className={classNames(
                    styles.base,
                    inputStyles,
                    meta.touched && meta.error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled,
                )}
                type={type}
                id={inputId}
                {...field}
                {...props}
            />

            {meta.touched && meta.error ? (<P className={classNames('error', styles.errorText)}>{meta.error}</P>) : null}
        </div>
    )
};

export default BaseInput;

