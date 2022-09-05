import classNames from 'classnames';
import {Formik, Form} from 'formik';
import {useState} from 'react';
import {Database} from 'timetracking-common';
import * as Yup from 'yup';

import TextInput from './ui/form/TextInput';
import Button from './ui/Button';
import {createClient} from '../lib/database';

interface IAddTextFormProps {
    className?: string;
    onClientAdded: () => void;
    onCancel: () => void;
}

const AddClientForm = ({className, onClientAdded, onCancel}: IAddTextFormProps) => {

    const [submitError, setSubmitError] = useState<string>('');

    const styles = {
        form: 'flex flex-row',
        error: 'border-red-600 focus:ring-red-600 text-red-600',
    };

    const initialFormState: Database.IClient = {
        client_name: '',
    };

    const validationSchema = Yup.object({
        client_name: Yup.string().required('Required'),
    });

    const submitForm = (values, {setSubmitting}) => {
        setSubmitError('');
        createClient(values)
            .then(() => {
                onClientAdded();
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
                <Form className={classNames('add-client-form flex flex-col', styles.form, className)}>
                    <div className='flex flex-row mb-4'>
                        <TextInput
                            name='client_name'
                            label='Client Name'
                            className='grow'
                            required
                            placeholder='Enter the name of a new client'/>
                    </div>

                    <div className='flex flex-row justify-end'>
                        <Button className='mr-1' disabled={!props.dirty || Object.keys(props.errors).length > 0 || props.isSubmitting} type='submit'>
                            Add Client
                        </Button>
                        <Button variant='secondary' disabled={props.isSubmitting} onClick={cancelForm}>Cancel</Button>
                    </div>

                    {submitError && <div className={classNames('submit-error', styles.error)}>{submitError}</div>}
                </Form>
            )}
        </Formik>
    )
};

export default AddClientForm;
