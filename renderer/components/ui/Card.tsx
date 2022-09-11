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

interface ICardProps {
    className?: string;
    children?: ReactNode;
}

const commonStyles = {
    base: 'bg-gray-700'
};

const Card = ({ className, children }: ICardProps) => {
    return (
        <div className={classNames('card', 'flex flex-col overflow-hidden rounded shadow-md border-gray-700 border', commonStyles.base, className)}>
            {children}
        </div>
    )
}

interface ICardHeaderProps extends ICardProps {}

const Header = ({ className, children }: ICardHeaderProps) => {
    return (
        <div className={classNames('card-header', 'flex flex-grow p-4 hover:bg-gray-800 transition ease-in-out', commonStyles.base, className)}>
            {children}
        </div>
    )
}

interface ICardBodyProps extends ICardProps {}

const Body = ({ className, children }: ICardBodyProps) => {
    return (
        <div className={classNames('card-body', commonStyles.base, className)}>
            {children}
        </div>
    )
}

interface ICardFooterProps extends ICardProps {}

const Footer = ({ className, children }: ICardFooterProps) => {
    return (
        <div className={classNames('card-footer', commonStyles.base, className)}>
            {children}
        </div>
    )
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;