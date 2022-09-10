/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {Formik, Form} from 'formik';
import {ReactNode, useCallback, useState} from 'react';
import * as Yup from 'yup';

import BaseText, {IBaseTextProps} from './BaseText';
import TextInput from '../form/TextInput';

export interface IBaseEditableTextProps extends IBaseTextProps {
    editable?: boolean;
    onSave?: (string) => Promise<void>;
}

const BaseEditableText = ({editable = false, onSave, className, children, ...props}: IBaseEditableTextProps) => {
    const [text, setText] = useState<ReactNode>(children);
    const [editing, setEditing] = useState<boolean>(false);

    const Tag = isInline(props.as, className) ? 'span' : 'div';

    const submitForm = (values, {setSubmitting}) => {
        onSave(values.text)
            .then(() => {
                setText(values.text);
                setEditing(false);
            })
            .catch(err => console.error(err))
            .finally(() => setSubmitting(false));
    };

    const cancelForm = () => {
        setEditing(false);
    }

    const validationSchema = Yup.object({
        text: Yup.string().required('Required'),
    });

    const textClicked = (e) => {
        if (editable && canEdit(text)) {
            setEditing(true);
        }
    };

    const styles = {
        base: 'w-full',
        editable: 'hover:cursor-pointer',
        block: 'flex flex-row',
        inline: 'inline',
    };

    return (
        <Tag
            className={classNames(
                'base-editable-text',
                styles.base,
                editable && styles.editable,
                isInline(props.as, className) ? styles.inline : styles.block,
                className)}>
            {!editing && <BaseText className={classNames('w-full')} onClick={textClicked} {...props}>{text}</BaseText>}

            {editing && canEdit(text) &&
                <EditForm
                    text={text}
                    onSubmit={submitForm}
                    cancelForm={cancelForm}
                    validationSchema={validationSchema}
                    autoFocus={props.autoFocus}/>}
        </Tag>
    )
}

interface IEditFormProps {
    text: string | ReactNode;
    onSubmit: (values: any, {setSubmitting}: { setSubmitting: any; }) => void;
    cancelForm: () => void;
    validationSchema: object;
    className?: string;
    autoFocus?: boolean;
}

const EditForm = ({text, onSubmit, cancelForm, validationSchema, autoFocus = false, className}: IEditFormProps) => {

    // TODO: Tabbing away from the input should submit the change

    const keyPressed = useCallback((e) => {
        if (e.key === 'Escape') {
            cancelForm();
        }
    }, []);

    return (
        <Formik initialValues={{text}}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
            <Form className='flex flex-row grow'>
                <TextInput
                    className='w-full mr-1'
                    inputStyles='w-full'
                    name='text'
                    onBlur={cancelForm}
                    onKeyDown={keyPressed}
                    autoFocus={autoFocus}/>
            </Form>
        </Formik>
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

export default BaseEditableText;