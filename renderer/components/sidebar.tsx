import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock, faHome, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';

interface ISidebarProps {
    className?: string;
}

export default function Sidebar({className}: ISidebarProps) {
    return (
        <aside className={classNames('sidebar flex flex-col p-3 bg-black', className)}>
            <SidebarItem href='/home'>
                <FontAwesomeIcon icon={faHome} /> Home
            </SidebarItem>

            <SidebarItem href='/timekeeping'>
                <FontAwesomeIcon icon={faClock} /> Timekeeping
            </SidebarItem>

            <SidebarItem href='/clients'>
                <FontAwesomeIcon icon={faPeopleGroup} /> Clients & Projects
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
    return (
        <div className={classNames('sidebar-item p-3', className)}>
            <Link href={href}>
                <a>{children}</a>
            </Link>
        </div>
    )
}
