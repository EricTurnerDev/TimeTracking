/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseInput, {IBaseInputProps} from './BaseInput';
import classNames from 'classnames';
import {useField} from "formik";

interface INumberInputProps extends IBaseInputProps {
    name: string;
    step?: string;
}

const NumberInput = ({className, ...props}: INumberInputProps) => {
    const [field, meta] = useField(props);

    return (
        <BaseInput type='number' className={classNames('number-input', className)} touched={meta.touched} error={meta.error} {...field} {...props} />
    )
};

export default NumberInput;