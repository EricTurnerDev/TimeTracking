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

import TextElement from '@/lib/types/TextElement';

export interface IBaseTextProps {
    as?: TextElement;
    size?: 'sm' | 'base' | 'lg';
    variant?: 'dark' | 'medium' | 'light';
    className?: string;
    children: ReactNode;
    [x:string]: any;
}

const BaseText = ({as = 'p', size, variant, className, children, ...props}: IBaseTextProps) => {
    const Tag = as;

    const styles = {
        base: '',
        size: {
            sm: 'font-medium text-sm leading-normal',
            base: 'font-medium text-base leading-normal',
            lg: 'font-semibold text-lg md:text-2xl leading-relaxed',
        },
        variant: {
            dark: 'text-gray-900',
            medium: 'text-gray-600',
            light: 'text-white',
        }
    }

    return (
        <Tag className={classNames(
            'base-text',
            styles.base,
            size && styles.size[size],
            variant && styles.variant[variant],
            className)}
             {...props}>
            {children}
        </Tag>
    )
}

export default BaseText;