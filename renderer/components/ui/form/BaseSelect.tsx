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

import Label from '@/components/ui/form/Label';
import P from '@/components/ui/text/P';

export interface IBaseSelectProps {
    id?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    selectStyles?: string; // Additional styles applied directly to the <select> element
    children?: ReactNode;
    touched?: boolean;
    error?: string;
    value?: any;
    onBlur?: (e:any) => void;
    onChange?: (e:any) => void;
    onKeyDown?: (e) => any;
    autoFocus?: boolean;
}

const BaseSelect = ({id, label, required, disabled, className, selectStyles, children, touched=false, error='', ...props}: IBaseSelectProps) => {

    const styles = {
        base: 'text-gray-700 rounded',
        state: {
            normal: 'placeholder-gray-400 border-gray-300 focus:ring-purple-600',
            error: 'border-red-600 focus:ring-red-600 text-red-600',
            valid: 'border-green-600 focus:ring-green-600',
            disabled: 'cursor-not-allowed bg-gray-100 shadow-inner text-gray-400',
        },
        errorText: 'mt-2 text-sm text-red-600',
    };

    const inputId = useId();

    return (
        <div className={classNames('base-select', className)} id={id}>
            {label && <Label id={inputId}>{label}{required && '*'}</Label>}

            <select
                className={classNames(
                    styles.base,
                    selectStyles,
                    touched && error ? styles.state.error : styles.state.normal,
                    disabled && styles.state.disabled
                )}
                id={inputId}
                {...props}>
                {children}
            </select>

            {touched && error ? (<P className={classNames('error', styles.errorText)}>{error}</P>) : null}
        </div>
    )
};

export default BaseSelect;