import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock, faHome, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import Span from './ui/text/Span';

const styles = {
    base: 'flex flex-col p-3 bg-black',
};

interface ISidebarProps {
    className?: string;
}

export default function Sidebar({className}: ISidebarProps) {
    return (
        <aside className={classNames('sidebar', styles.base, className)}>
            <SidebarItem href='/home'>
                <FontAwesomeIcon icon={faHome} /> <Span>Home</Span>
            </SidebarItem>

            <SidebarItem href='/timekeeping'>
                <FontAwesomeIcon icon={faClock} /> <Span>Timekeeping</Span>
            </SidebarItem>

            <SidebarItem href='/clients'>
                <FontAwesomeIcon icon={faPeopleGroup} /> <Span>Clients & Projects</Span>
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
        <div className={classNames('sidebar-item p-3 text-gray-300 hover:text-white', className)}>
            <Link href={href}>
                <a>{children}</a>
            </Link>
        </div>
    )
}
