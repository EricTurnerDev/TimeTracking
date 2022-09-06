/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseInput, {IBaseInput} from './BaseInput';
import classNames from 'classnames';

interface IDateTimeInputProps extends IBaseInput {}

const DateTimeInput = ({className, ...props}: IDateTimeInputProps) => {
    return (
        <BaseInput type='datetime-local' className={classNames('datetime-input', className)} {...props} />
    )
};

export default DateTimeInput;