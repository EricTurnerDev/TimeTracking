import classNames from 'classnames';
import {Formik, Form} from 'formik';
import {useState} from 'react';
import {Database} from 'timetracking-common';
import * as Yup from 'yup';

import HiddenInput from './ui/form/HiddenInput';
import TextInput from './ui/form/TextInput';
import Button from './ui/Button';
import {createProject} from '../lib/database';

interface IAddProjectFormProps {
    client: Database.IClient;
    className?: string;
    onProjectAdded: () => void;
    onCancel: () => void;
}

const AddProjectForm = ({client, className, onProjectAdded, onCancel}: IAddProjectFormProps) => {

    const [submitError, setSubmitError] = useState<string>('');

    const styles = {
        form: 'flex flex-row',
        error: 'border-red-600 focus:ring-red-600 text-red-600',
    };

    const initialFormState: Database.IProject = {
        client_id: client.id,
        project_name: '',
    };

    const validationSchema = Yup.object({
        client_id: Yup.number().required('Required'),
        project_name: Yup.string().required('Required'),
    });

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