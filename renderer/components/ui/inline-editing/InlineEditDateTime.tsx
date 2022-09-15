/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import classNames from 'classnames';
import {useCallback, useState} from 'react';

import BaseInput from '../form/BaseInput';
import {utcISOToLocalISO, isoToLocale, localISOToUTCISO} from '../../../lib/dateTimeConversion';
import TextElement from '../../../lib/types/TextElement';

export interface ISubtleDateTimeInputProps {
    as?: TextElement;
    className?: string;
    children: string;
    onSave: (string) => Promise<void>;
    autoFocus?: boolean;
}

const InlineEditDateTime = ({
                                 as = 'p',
                                 className,
                                 children,
                                 onSave,
                                 autoFocus = false,
                                 ...props
                             }: ISubtleDateTimeInputProps) => {
    const Tag = as;

    const [editing, setEditing] = useState<boolean>(false);

    // Internally we keep track of it as an ISO date string in local time.
    const [date, setDate] = useState<string>(utcISOToLocalISO(children));
    const [editedDate, setEditedDate] = useState<string>(utcISOToLocalISO(children));

    const keyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            revert();
        }
        if (e.key === 'Enter') {
            setEditedDate(e.target.value);
            onSave(localISOToUTCISO(e.target.value))
                .then(() => {
                    setDate(e.target.value);
                    setEditing(false);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, []);

    const dateClicked = () => {
        // Start editing
        setEditedDate(date);
        setEditing(true);
    }

    const onBlur = (e) => {
        revert();
    }

    const onChange = (e) => {
        setEditedDate(e.target.value);
    }

    const revert = () => {
        setEditedDate(date);
        setEditing(false);
    };

    return (
        <div className={classNames('subtle-datetime-input', 'z-50 hover:cursor-pointer', className)}>
            {!editing && <Tag onClick={dateClicked}>{isoToLocale(date)}</Tag>}
            {editing &&
                <BaseInput
                    type='datetime-local'
                    value={editedDate}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    autoFocus={autoFocus}
                />}
        </div>
    )
};

export default InlineEditDateTime;