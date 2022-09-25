/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Creates a gear icon that shows a popup menu with actions to perform on the row.
 */

import classNames from 'classnames';
import {ReactNode, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {DatabaseInterfaces} from 'timetracking-common';

import {clone, gear, Icon, trash} from '@/components/ui/Icon';

interface IRowActionsProps {
    row: DatabaseInterfaces.IDetailedTimeRecord;
    deleteRow?: (number) => Promise<void>;
    onDelete?: () => any;
    cloneRow?: (number) => Promise<void>;
    onClone?: () => any;
}

export const RowActions = ({row, deleteRow, onDelete, cloneRow, onClone}: IRowActionsProps) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuLocation, setMenuLocation] = useState({x: 0, y: 0});
    const [menuWidth, setMenuWidth] = useState(0);
    const menuRef = useRef(null);

    const hideMenu = () => {
        setMenuVisible(false);
    };

    useLayoutEffect(() => {
        setMenuWidth(menuRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        if (menuVisible) {
            menuRef.current.focus();
        }
    }, [menuVisible]);

    const triggerClicked = (e) => {
        setMenuLocation({x: e.clientX, y: e.clientY});
        setMenuVisible(visible => !visible);
    };

    return (
        <div className='row-actions z-50' onBlur={hideMenu} tabIndex={-1}>
            <Icon
                icon={gear}
                className={classNames(
                    'row-actions-trigger',
                    'hover:cursor-pointer'
                )}
                onMouseDown={triggerClicked}
            />

            <div
                className={classNames(
                    'row-actions-menu',
                    'fixed bg-gray-600 text-gray-50 rounded',
                    menuVisible ? 'visible' : 'invisible'
                )}
                ref={menuRef}
                style={{top: menuLocation.y + 8, left: menuLocation.x - menuWidth - 8}}>
                <div>
                    {cloneRow && onClone &&
                        <RowAction row={row} action={cloneRow} actionSucceeded={onClone} actionCompleted={hideMenu}>
                            <Icon icon={clone} className='mr-2'/> Clone
                        </RowAction>}

                    {deleteRow && onDelete &&
                        <RowAction row={row} action={deleteRow} actionSucceeded={onDelete} actionCompleted={hideMenu}>
                            <Icon icon={trash} className='mr-2'/> Delete
                        </RowAction>}
                </div>
            </div>

        </div>
    )
};

interface IRowActionProps {
    row: DatabaseInterfaces.IDatabaseEntity;
    action: (rowId: number) => Promise<void>;
    actionSucceeded?: () => void;
    actionCompleted?: () => void;
    children: ReactNode;
}

export const RowAction = ({row, action, actionSucceeded, actionCompleted, children}: IRowActionProps) => {
    const onClick = () => {
        action(row.id)
            .then(() => {
                if (actionSucceeded) {
                    actionSucceeded();
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (actionCompleted) {
                    actionCompleted();
                }
            });
    };

    return (
        <div className='row-action block p-4 hover:cursor-pointer hover:bg-black' onClick={onClick}>
            {children}
        </div>
    )
};