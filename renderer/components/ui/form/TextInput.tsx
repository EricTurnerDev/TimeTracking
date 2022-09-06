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

interface ITextInput extends IBaseInput {
    placeholder?: string;
}

const TextInput = ({className, ...props}: ITextInput) => {
    return (
        <BaseInput type='text' className={classNames('text-input', className)} {...props} />
    )
};

export default TextInput;

