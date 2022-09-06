/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Icon, clock, home, people} from './ui/Icon';
import Span from './ui/text/Span';

interface ISidebarProps {
    className?: string;
}

export default function Sidebar({className}: ISidebarProps) {
    const styles = {
        base: 'flex flex-col p-3 bg-black',
        icon: 'mr-4',
    };

    return (
        <aside className={classNames('sidebar', styles.base, className)}>
            <SidebarItem href='/home'>
                <Icon icon={home} className={styles.icon}/> <Span>Home</Span>
            </SidebarItem>

            <SidebarItem href='/timekeeping'>
                <Icon icon={clock} className={styles.icon}/> <Span>Timekeeping</Span>
            </SidebarItem>

            <SidebarItem href='/clients'>
                <Icon icon={people} className={styles.icon}/> <Span>Clients & Projects</Span>
            </SidebarItem>
        </aside>
    )
}

interface ISidebarItemProps {
    href: string;
    className?: string;
    children: React.ReactNode
}

function SidebarItem({href, className, children}: ISidebarItemProps) {
    const router = useRouter();

    const styles = {
        base: 'sidebar-item p-3 text-gray-300',
        active: router.pathname === href ? 'text-blue-500' : 'hover:text-white',
    };

    return (
        <div className={classNames(styles.base, styles.active, className)}>
            <Link href={href}>
                <a>{children}</a>
            </Link>
        </div>
    )
}
