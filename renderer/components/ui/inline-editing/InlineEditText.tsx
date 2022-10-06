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

import BaseInput, {IBaseInputProps} from '@/components/ui/form/BaseInput';
import TextElement from "@/lib/types/TextElement";

export interface IInlineEditTextProps extends IBaseInputProps {
    as?: TextElement;
    children?: ReactNode;
    onSave?: (string) => Promise<void>;
}

const InlineEditText = ({
                             as = 'p',
                             className,
                             children,
                             onSave,
                             ...props
                         }: IInlineEditTextProps) => {
    const Tag = as;

    const [text, setText] = useState<ReactNode>(children);
    const [editedText, setEditedText] = useState<ReactNode>();
    const [editing, setEditing] = useState<boolean>(false);

    const keyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setEditing(false);
        } else if (e.key === 'Enter') {
            onSave(e.target.value)
                .then(() => {
                    setText(e.target.value);
                    setEditing(false);
                })
                .catch(err => console.error(err))
        }
    }, []);

    const textClicked = () => {
        setEditedText(text);
        setEditing(true);
    }

    const onChange = (e) => {
        setEditedText(e.target.value);
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
                    value={editedText}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={keyDown}
                    {...props}
                />}
        </div>
    )
};

function canEdit(children: any): boolean {
    // Only a strings can be edited.
    return typeof children === 'string';
}

export default InlineEditText;