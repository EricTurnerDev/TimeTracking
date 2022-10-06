/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {useCallback, useEffect, useState} from 'react';
import classNames from 'classnames';

import BaseSelect, {IBaseSelectProps} from '@/components/ui/form/BaseSelect';
import isBlank from '@/lib/isBlank';
import NonEmptyArray from "@/lib/types/NonEmptyArray";
import SelectOption from "@/lib/types/SelectOption";
import TextElement from "@/lib/types/TextElement";

interface IInlineEditSelectProps extends IBaseSelectProps {
    as?: TextElement;
    options: NonEmptyArray<SelectOption>;
    value: string;
    allowBlank?: boolean;
    selectionChanged: (Option) => Promise<void>;
}

const emptyOption: SelectOption = {value: '', text: ''};

const InlineEditSelect = ({as = 'p', options, value, allowBlank=true, selectionChanged, className, ...props}: IInlineEditSelectProps) => {

    const Tag = as;

    const [editing, setEditing] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedText, setSelectedText] = useState<string>('');

    useEffect(() => {
        const opt = options?.find(option => {
            return option.value === value;
        }) || emptyOption;
        setSelectedValue(opt.value);
        setSelectedText(opt.text);
    }, [options, value]);

    const keyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            revert();
        }
    }, []);

    const textClicked = () => {
        setEditing(true);
    }

    const optionSelected = (e) => {
        const value = e.target.value;
        const text = e.target.selectedOptions[0].label;
        if (allowBlank || !isBlank(value)) {
            setSelectedValue(value);
            setSelectedText(text);
            selectionChanged({value, text})
                .then(() => {
                    setEditing(false);
                })
                .catch(err => console.error(err));
        }
    };

    const onBlur = (e) => {
        revert()
    };

    const revert = () => {
        setEditing(false);
    }

    return (
        <div className={classNames('inline-edit-select', 'hover:cursor-pointer', className)}>
            {!editing && !selectedText && <Tag className='h-6 width-full' onClick={textClicked}></Tag>}
            {!editing && selectedText && <Tag className='width-full' onClick={textClicked}>{selectedText}</Tag>}
            {editing && <BaseSelect
                value={selectedValue}
                onBlur={onBlur}
                onChange={optionSelected}
                onKeyDown={keyDown}
                {...props}>
                {options.map(option => {
                    return <option key={option.value} value={option.value} disabled={!allowBlank && isBlank(option.value)}>{option.text}</option>
                })}
            </BaseSelect>}
        </div>
    )
};

export default InlineEditSelect;