/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {ReactNode} from 'react';
import BaseText from './BaseText';

interface ISpanProps {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const Span = ({className, children, ...rest}: ISpanProps) => {
    return (
        <BaseText className={className} as='span' {...rest}>{children}</BaseText>
    )
}

export default Span;