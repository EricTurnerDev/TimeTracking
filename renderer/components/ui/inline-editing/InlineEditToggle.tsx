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

import TextElement from '@/lib/types/TextElement';
import BaseInput, {IBaseInputProps} from "@/components/ui/form/BaseInput";

export interface IInlineEditToggle extends IBaseInputProps {
    as?: TextElement;
    onSave: (boolean) => Promise<void>;
    value?: 0|1;
    formatter?: (number) => string;
    children?: string;
}

const InlineEditToggle = ({as = 'p', value=0, onSave, formatter=(v) => v ? 'on' : 'off', className, ...props}: IInlineEditToggle) => {
    const Tag = as;

    const [toggleState, setToggleState] = useState<0|1>(value);
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
        setToggleState(e.target.checked ? 1 : 0);
        onSave(e.target.checked ? 1 : 0)
            .then(() => {
                setEditing(false)
            })
            .catch(err => console.error(err));

    }

    return (
        <div className={classNames('inline-edit-checkbox', 'hover:cursor-pointer', className)}>
            {!editing && <Tag className='h-6 w-6 text-center' onClick={textClicked}>{formatter(toggleState)}</Tag>}
            {editing &&
                <BaseInput
                    type='checkbox'
                    value={toggleState}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    {...props} />}
        </div>
    )
};

export default InlineEditToggle;