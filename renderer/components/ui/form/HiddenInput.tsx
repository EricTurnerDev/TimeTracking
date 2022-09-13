/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {useField} from 'formik';

import BaseInput, {IBaseInputProps} from './BaseInput';

interface IHiddenInputProps extends IBaseInputProps {
    name: string;
}

const HiddenInput = ({...props}: IHiddenInputProps) => {
    const [field, meta] = useField(props);

    return (
        <BaseInput type='hidden' className='hidden-input' touched={meta.touched} error={meta.error} {...field} {...props} />
    )
};

export default HiddenInput;

