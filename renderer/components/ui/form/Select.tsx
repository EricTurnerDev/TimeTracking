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

import BaseSelect, {IBaseSelectProps} from './BaseSelect';

export interface ISelectProps extends IBaseSelectProps {
    name: string;
}

const Select = ({className, children, ...props}: ISelectProps) => {
    const [field, meta] = useField(props);

    return (
        <BaseSelect className={classNames('select', className)}
                    touched={meta.touched}
                    error={meta.error} {...field} {...props}>
            {children}
        </BaseSelect>
    )
};

export default Select;