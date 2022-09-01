import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock, faHome, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import Span from './ui/text/Span';

interface ISidebarProps {
    className?: string;
}

export default function Sidebar({className}: ISidebarProps) {
    const styles = {
        base: 'flex flex-col p-3 bg-black',
    };

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
