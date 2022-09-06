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

interface IPProps {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const P = ({className, children, ...rest}: IPProps) => {
    return (
        <BaseText className={className} as='p' {...rest}>{children}</BaseText>
    )
}

export default P;