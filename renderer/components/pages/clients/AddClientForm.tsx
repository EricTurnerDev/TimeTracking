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

import TextInput from '@/components/ui/form/TextInput';
import Button from '@/components/ui/Button';
import {createClient, getClients} from '@/lib/database';

interface IAddTextFormProps {
    className?: string;
    onClientAdded: () => void;
    onCancel: () => void;
}

const AddClientForm = ({className, onClientAdded, onCancel}: IAddTextFormProps) => {

    const [submitError, setSubmitError] = useState<string>('');
    const [clientNames, setClientNames] = useState<string[]>([]);

    const styles = {
        form: 'flex flex-row',
        error: 'border-red-600 focus:ring-red-600 text-red-600',
    };

    const initialFormState: DatabaseInterfaces.IClient = {
        client_name: '',
    };

    const validationSchema = Yup.object({
        client_name: Yup.string().test("Unique", "Client name needs to be unique", (clientName) => {
            return !clientNames.includes(clientName);
        }).required('Required'),
    });

    // Get client names once so validation can ensure that the user doesn't try to submit a duplicate client.
    useEffect(() => {
        getClients()
            .then(clients => setClientNames(clients.map(c => c.client_name)))
            .catch(err => console.error(err));
    }, [])

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
                            inputStyles='py-2 px-4 w-full'
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
