/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseEditableText, {IBaseEditableTextProps} from './BaseEditableText';

interface IH1Props extends IBaseEditableTextProps {}

const H1 = ({className, children, ...props}: IH1Props) => {
    return (
        <BaseEditableText className={className} as='h1' {...props}>{children}</BaseEditableText>
    )
}

export default H1;