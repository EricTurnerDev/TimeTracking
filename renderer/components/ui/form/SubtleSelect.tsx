/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {useState} from 'react';

import NonEmptyArray from "../../../lib/types/NonEmptyArray";
import Select, {ISelectProps} from './Select';
import SelectOption from "../../../lib/types/SelectOption";
import TextElement from "../../../lib/types/TextElement";

interface ISubtleSelectProps extends ISelectProps {
    as?: TextElement;
    options: NonEmptyArray<SelectOption>;
    value: string;
    className?: string;
    selectionChanged: (Option) => Promise<void>;
}

const SubtleSelect = ({name, as = 'p', options, value, selectionChanged, className}: ISubtleSelectProps) => {
    const Tag = as;

    const initialOption: SelectOption = options.find(option => option.value === value) || options[0];

    const [editing, setEditing] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(initialOption.value);
    const [selectedText, setSelectedText] = useState<string>(initialOption.text);

    const textClicked = () => {
        setEditing(true);
    }

    const optionSelected = (e) => {
        const value = e.target.value;
        const text = e.target.selectedOptions[0].label;
        setSelectedValue(value);
        setSelectedText(text);
        selectionChanged({value, text})
            .then(() => {
                setEditing(false);
            })
            .catch(err => console.error(err));
    };

    const onBlur = (e) => {
        setEditing(false);
    };

    return (
        <div style={{cursor: 'pointer'}} className={className}>
            {!editing && <Tag onClick={textClicked}>{selectedText}</Tag>}
            {editing && <Select name={name}
                                value={selectedValue}
                                onBlur={onBlur}
                                onChange={optionSelected}
                                autoFocus>
                {options.map(option => (<option key={option.value} value={option.value}>{option.text}</option>))}
            </Select>}
        </div>
    )
};

export default SubtleSelect;