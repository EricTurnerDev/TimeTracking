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

interface IH1Props {
    className?: string;
    children: ReactNode;
}

const H1 = ({className, children}: IH1Props) => {
    return (
        <BaseText className={className} as='h1'>{children}</BaseText>
    )
}

export default H1;