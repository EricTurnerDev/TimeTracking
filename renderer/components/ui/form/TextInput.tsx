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

import BaseInput, {IBaseInputProps} from './BaseInput';

export interface ITextInputProps extends IBaseInputProps {
    name: string;
    placeholder?: string;
}

const TextInput = ({className, ...props}: ITextInputProps) => {
    const [field, meta] = useField(props);

    return (
        <BaseInput type='text' className={classNames('text-input', className)} touched={meta.touched} error={meta.error} {...field} {...props} />
    )
};

export default TextInput;

