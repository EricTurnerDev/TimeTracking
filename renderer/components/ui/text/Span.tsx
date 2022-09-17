/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseText, {IBaseTextProps} from './BaseText';

interface ISpanProps extends IBaseTextProps {}

const Span = ({className, children, ...props}: ISpanProps) => {
    return (
        <BaseText className={className} as='span' {...props}>{children}</BaseText>
    )
}

export default Span;