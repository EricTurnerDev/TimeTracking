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

import TextElement from '../../../lib/types/TextElement';
import BaseInput from "../form/BaseInput";

export interface IInlineEditToggle {
    as?: TextElement;
    onSave: (boolean) => Promise<void>;
    autoFocus?: boolean;
    value?: boolean;
    formatter?: (boolean) => string;
    className?: string;
    children?: string;
}

const InlineEditToggle = ({as = 'p', value=false, onSave, autoFocus = false,  formatter=(v) => v ? 'on' : 'off', className}: IInlineEditToggle) => {
    const Tag = as;

    const [toggleState, setToggleState] = useState<boolean>(value);
    const [editing, setEditing] = useState<boolean>(false);

    const keyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            revert();
        }
    }, []);

    const onBlur = (e) => {
        revert();
    }

    const textClicked = (e) => {
        setEditing(true);
    }

    const revert = () => {
        setEditing(false);
    }

    const onChange = (e) => {
        setToggleState(e.target.checked);
        onSave(e.target.checked)
            .then(() => {
                setEditing(false)
            })
            .catch(err => console.error(err));

    }

    return (
        <div className={classNames('inline-edit-checkbox', 'min-w-full hover:cursor-pointer', className)}>
            {!editing && <Tag className='min-w-full h-5' onClick={textClicked}>{formatter(toggleState)}</Tag>}
            {editing &&
                <BaseInput
                    type='checkbox'
                    value={toggleState}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    autoFocus={autoFocus}/>}
        </div>
    )
};

export default InlineEditToggle;