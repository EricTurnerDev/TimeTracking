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

interface IH2Props {
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const H2 = ({className, children, ...rest}: IH2Props) => {
    return (
        <BaseText className={className} as='h2' {...rest}>{children}</BaseText>
    )
}

export default H2;