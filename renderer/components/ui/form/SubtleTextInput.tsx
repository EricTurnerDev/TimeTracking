/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {ReactNode, useCallback, useState} from 'react';

import BaseInput from './BaseInput';
import TextElement from "../../../lib/types/TextElement";

export interface ISubtleTextInputProps {
    as?: TextElement;
    className?: string;
    children?: ReactNode;
    onSave?: (string) => Promise<void>;
    autoFocus?: boolean;
}

const SubtleTextInput = ({as = 'p', className, children, onSave, autoFocus=false, ...props}: ISubtleTextInputProps) => {
    const Tag = as;

    const [text, setText] = useState<ReactNode>(children);
    const [editing, setEditing] = useState<boolean>(false);

    const keyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setEditing(false);
        } else if (e.key === 'Enter') {
            onSave(e.target.value)
                .then(() => {
                    setEditing(false);
                })
                .catch(err => console.error(err))
        }
    }, []);

    const textClicked = () => {
        setEditing(true);
    }

    const onChange = (e) => {
        setText(e.target.value);
    }

    const onBlur = (e) => {
        setEditing(false);
    };

    return (
        <div className={classNames('subtle-text-input', 'hover:cursor-pointer', className)}>
            {!editing && <Tag onClick={textClicked}>{text}</Tag>}
            {editing && canEdit(children) &&
                <BaseInput
                    type='text'
                    value={text}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    autoFocus={autoFocus}/>}
        </div>
    )
};

function canEdit(children: any): boolean {
    // Only a strings can be edited.
    return typeof children === 'string';
}

function isInline(element: string = '', className: string = ''): boolean {
    const blockRegex = /(^|\s)block(\s|$)/g;
    const inlineRegex = /(^|\s)inline(\s|$)/g

    // Element is inline and hasn't been overridden with the 'block' tailwind class.
    if ((element === 'span' || element === 'cite' || element === 'abbr') && !className.match(blockRegex)) {
        return true;
    }

    // Element is block, but has been overridden with the 'inline' tailwind class.
    return !!className.match(inlineRegex);
}

export default SubtleTextInput;