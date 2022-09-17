/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {useCallback, useState} from 'react';
import classNames from 'classnames';

import BaseSelect from '../form/BaseSelect';
import isBlank from '../../../lib/isBlank';
import NonEmptyArray from "../../../lib/types/NonEmptyArray";
import SelectOption from "../../../lib/types/SelectOption";
import TextElement from "../../../lib/types/TextElement";

interface ISubtleSelectProps {
    as?: TextElement;
    options: NonEmptyArray<SelectOption>;
    value: string;
    allowBlank?: boolean;
    selectionChanged: (Option) => Promise<void>;
    autoFocus?: boolean;
    className?: string;
}

const emptyOption: SelectOption = {value: '', text: ''};

const InlineEditSelect = ({as = 'p', options, value, allowBlank=true, selectionChanged, autoFocus=false, className}: ISubtleSelectProps) => {
    const Tag = as;

    const initialOption: SelectOption = options?.find(option => {
        return option.value === value;
    }) || emptyOption;

    const [editing, setEditing] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(initialOption.value);
    const [selectedText, setSelectedText] = useState<string>(initialOption.text);

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
        <div className={classNames('inline-edit-select', 'min-w-full hover:cursor-pointer', className)}>
            {!editing && !selectedText && <Tag className='min-w-full h-6' onClick={textClicked}></Tag>}
            {!editing && selectedText && <Tag onClick={textClicked}>{selectedText}</Tag>}
            {editing && <BaseSelect
                value={selectedValue}
                onBlur={onBlur}
                onChange={optionSelected}
                onKeyDown={keyDown}
                autoFocus={autoFocus}>
                {options.map(option => {
                    return <option key={option.value} value={option.value} disabled={!allowBlank && isBlank(option.value)}>{option.text}</option>
                })}
            </BaseSelect>}
        </div>
    )
};

export default InlineEditSelect;