/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseEditableText, {IBaseEditableTextProps} from './BaseEditableText';

interface IPProps extends IBaseEditableTextProps {}

const P = ({className, children, ...props}: IPProps) => {
    return (
        <BaseEditableText className={className} as='p' {...props}>{children}</BaseEditableText>
    )
}

export default P;