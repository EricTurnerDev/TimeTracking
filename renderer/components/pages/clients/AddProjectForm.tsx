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
import {useEffect, useState} from 'react';
import {DatabaseInterfaces} from 'timetracking-common';
import * as Yup from 'yup';

import HiddenInput from '@/components/ui/form/HiddenInput';
import TextInput from '@/components/ui/form/TextInput';
import Button from '@/components/ui/Button';
import {createProject, getProjects} from '@/lib/database';

interface IAddProjectFormProps {
    client: DatabaseInterfaces.IClient;
    className?: string;
    onProjectAdded: () => void;
    onCancel: () => void;
}

const AddProjectForm = ({client, className, onProjectAdded, onCancel}: IAddProjectFormProps) => {

    const [submitError, setSubmitError] = useState<string>('');
    const [projectNames, setProjectNames] = useState<string[]>([]);

    const styles = {
        form: 'flex flex-row',
        error: 'border-red-600 focus:ring-red-600 text-red-600',
    };

    const initialFormState: DatabaseInterfaces.IProject = {
        client_id: client.id,
        project_name: '',
    };

    const validationSchema = Yup.object({
        client_id: Yup.number().required('Required'),
        project_name: Yup.string().test("Unique", "Project name needs to be unique", (projectName) => {
            return !projectNames.includes(projectName);
        }).required('Required'),
    });

    // Get project names once so validation can ensure that the user doesn't try to submit a duplicate project.
    useEffect(() => {
        getProjects({clientId: client.id})
            .then(projects => setProjectNames(projects.map(p => p.project_name)))
            .catch(err => console.error(err));
    }, []);

    const submitForm = (values, {setSubmitting}) => {
        setSubmitError('');
        createProject(values)
            .then(() => {
                onProjectAdded();
            })
            .catch(err => {
                setSubmitError(err.message);
            })
            .finally(() => setSubmitting(false));
    };

    const cancelForm = () => {
        setSubmitError('');
        onCancel();
    }

    return (
        <Formik
            initialValues={initialFormState}
            onSubmit={submitForm}
            validationSchema={validationSchema}>
            {props => (
                <Form className={classNames('add-project-form flex flex-col', styles.form, className)}>
                    <HiddenInput name='client_id' />
                    <div className='flex flex-row mb-4'>
                        <TextInput
                            name='project_name'
                            label='Project Name'
                            className='grow'
                            inputStyles='py-2 px-4 w-full'
                            required
                            placeholder='Enter the name of a new Project'/>
                    </div>

                    <div className='flex flex-row justify-end'>
                        <Button className='mr-1' disabled={!props.dirty || Object.keys(props.errors).length > 0 || props.isSubmitting} type='submit'>
                            Add Project
                        </Button>
                        <Button variant='secondary' disabled={props.isSubmitting} onClick={cancelForm}>Cancel</Button>
                    </div>

                    {submitError && <div className={classNames('submit-error', styles.error)}>{submitError}</div>}
                </Form>)}
        </Formik>
    )
};

export default AddProjectForm;