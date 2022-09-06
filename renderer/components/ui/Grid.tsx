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
    base: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 auto-rows-fr'
};

interface IGridProps {
    className?: string;
    children?: ReactNode;
    [x:string]: any;
}

export default function Grid({className, children, ...rest}: IGridProps) {
    return (
        <div className={classNames(styles.base, className)} {...rest}>
            {children}
        </div>
    )
}