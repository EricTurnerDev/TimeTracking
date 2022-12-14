/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {useId} from 'react';

import InputElement from '@/lib/types/InputElement';
import Label from '@/components/ui/form/Label';
import P from '@/components/ui/text/P';

export interface IBaseInputProps {
    id?: string;
    type?: InputElement;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
    inputStyles?: string; // Additional styles applied directly to the <input> element
    onKeyDown?: (e) => any;
    touched?: boolean;
    error?: string;
    onBlur?: (any) => any;
    onChange?: (any) => any;
    value?: any;
}

const BaseInput = ({id, type='text', label, required=false, disabled=false, className, inputStyles, touched=false, error='', value, ...props}: IBaseInputProps) => {

    const styles = {
        base: 'appearance-none border bg-white text-gray-700 shadow-md text-base focus:outline-none focus:ring-2 focus:border-transparent rounded',
        state: {
            normal: 'placeholder-gray-400 border-gray-300 focus:ring-purple-600',
            error: 'border-red-600 focus:ring-red-600 text-red-600',
            valid: 'border-green-600 focus:ring-green-600',
            disabled: 'cursor-not-allowed bg-gray-100 shadow-inner text-gray-400',
        },
        errorText: 'mt-2 text-sm text-red-600',
    };

    const inputId = useId();

    const valueProp = type === 'checkbox' ? {checked: value} : {value};

    return (
        <div className={classNames('base-input', className)} id={id}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <input
                className={classNames(
                    styles.base,
                    inputStyles,
                    touched && error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled,
                )}
                type={type}
                id={inputId}
                {...valueProp}
                {...props}
            />

            {touched && error ? (<P className={classNames('error', styles.errorText)}>{error}</P>) : null}
        </div>
    )
};

export default BaseInput;

