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
import {ReactNode, useState} from 'react';
import * as Yup from 'yup';

import BaseText, {IBaseTextProps} from './BaseText';
import Button from '../Button';
import {Icon, pencil} from '../Icon';
import TextInput from '../form/TextInput';

export interface IBaseEditableTextProps extends IBaseTextProps {
    editable?: boolean;
    onSave?: (string) => Promise<void>;
}

const BaseEditableText = ({editable = false, onSave, className, children, ...props}: IBaseEditableTextProps) => {
    const [text, setText] = useState<ReactNode>(children);
    const [editing, setEditing] = useState<boolean>(false);

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

    const editIconClicked = (e) => {
        setEditing(true);
    };

    return (
        <div className={classNames('base-editable-text', 'flex flex-row justify-between items-center', className)}>
            {!editing && <BaseText {...props}>{text}</BaseText>}
            {editable && canEdit(text) && !editing && <Icon icon={pencil} className='hover:cursor-pointer' onClick={editIconClicked}/>}

            {editing && canEdit(text) &&
                <EditForm text={text}
                          onSubmit={submitForm}
                          cancelForm={cancelForm}
                          validationSchema={validationSchema}/>}
        </div>
    )
}

interface IEditFormProps {
    text: string | ReactNode;
    onSubmit: (values: any, {setSubmitting}: { setSubmitting: any; }) => void;
    cancelForm: () => void;
    validationSchema: object;
}

const EditForm = ({text, onSubmit, cancelForm, validationSchema}: IEditFormProps) => {
    return (
        <Formik initialValues={{text}}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
            {formikProps => (
                <Form className='flex flex-row grow'>
                    <TextInput className='w-full mr-1' inputStyles='w-full' name='text'/>
                    <Button type='submit'
                            className='mr-1'
                            disabled={!formikProps.dirty || Object.keys(formikProps.errors).length > 0 || formikProps.isSubmitting}>Save</Button>
                    <Button variant='secondary' disabled={formikProps.isSubmitting} onClick={cancelForm}>Cancel</Button>
                </Form>)}
        </Formik>
    )
};

function canEdit(children: any): boolean {
    // Only a strings can be edited.
    return typeof children === 'string';
}

export default BaseEditableText;