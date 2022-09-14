/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import BaseText, {IBaseTextProps} from './BaseText';

interface IH3Props extends IBaseTextProps {}

const H3 = ({className, children, ...props}: IH3Props) => {
    return (
        <BaseText className={className} as='h3' {...props}>{children}</BaseText>
    )
}

export default H3;