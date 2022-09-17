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

interface ICheckboxInputProps extends IBaseInputProps {
    name: string
}

const CheckboxInput = ({className, ...props}: ICheckboxInputProps) => {
    const [field, meta] = useField(props);

    return (
        <BaseInput type='checkbox' className={classNames('checkbox-input', className)} touched={meta.touched} error={meta.error} inputStyles='p-0' {...field} {...props} />
    )
};

export default CheckboxInput;

