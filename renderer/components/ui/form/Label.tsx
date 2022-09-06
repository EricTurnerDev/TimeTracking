/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {ReactNode} from 'react';

const styles = {
    base: 'block mb-2 text-base font-medium text-gray-400',
}

interface IBaseLabelProps {
    id: string;
    className?: string;
    children?: ReactNode
}

const Label = ({id, className, children, ...props}: IBaseLabelProps) => {
    return (
        <label
            className={classNames('label', styles.base, className)}
            htmlFor={id}
            {...props}>
            {children}
        </label>
    )
}

export default Label;