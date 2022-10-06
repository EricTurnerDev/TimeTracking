/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import classNames from 'classnames';
import {DateTime} from 'luxon';
import {useCallback, useState} from 'react';

import BaseInput, {IBaseInputProps} from '@/components/ui/form/BaseInput';
import {isoToLocale, localISOToUTCISO, utcISOToLocalISO} from '@/lib/dateTimeConversion';
import TextElement from '@/lib/types/TextElement';

export interface IInlineEditDateTimeProps extends IBaseInputProps {
    as?: TextElement;
    children: string;
    onSave: (string) => Promise<void>;
}

const InlineEditDateTime = ({
                                 as = 'p',
                                 className,
                                 children,
                                 onSave,
                                 ...props
                             }: IInlineEditDateTimeProps) => {
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
            onSave(e.target.value)
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
        <div className={classNames('inline-edit-datetime', 'hover:cursor-pointer', className)}>
            {!editing && !date && <Tag className='h-6 w-30' onClick={dateClicked}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Tag>}
            {!editing && date && <Tag className='h-6 w-30' onClick={dateClicked}>{isoToLocale(date)}</Tag>}
            {editing &&
                <BaseInput
                    type='datetime-local'
                    value={DateTime.fromISO(editedDate).toFormat("yyyy-MM-dd'T'HH:mm")}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    {...props}
                />}
        </div>
    )
};

export default InlineEditDateTime;