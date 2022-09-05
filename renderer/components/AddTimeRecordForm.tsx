import classNames from 'classnames';
import {Formik, Form, useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';
import {DateTime} from 'luxon';
import * as Yup from 'yup';

import Button from './ui/Button';
import {createTimeRecord, getClients, getProjects} from '../lib/database';
import CheckboxInput from './ui/form/CheckboxInput';
import DateTimeInput from './ui/form/DateTimeInput';
import NumberInput from './ui/form/NumberInput';
import SelectInput from './ui/form/SelectInput';
import TextInput from './ui/form/TextInput';

interface IAddTimeRecordFormProps {
    className?: string;
    onTimeRecordAdded: () => void;
    onCancel?: () => void;
}

export default function AddTimeRecordForm({onTimeRecordAdded, onCancel, className}: IAddTimeRecordFormProps) {
    const styles = {
        base: 'p-4',
        error: 'border-red-600 focus:ring-red-600 text-red-600',
    };

    const initialFormState: Database.ITimeRecord = {
        invoice_activity: '',
        work_description: '',
        client_id: 0,
        project_id: 0,
        start_ts: '',
        end_ts: '',
        adjustment: 0.0,
        billable: false,
    };

    const validationSchema = Yup.object({
        invoice_activity: Yup.string().required('Required'),
        work_description: Yup.string().required('Required'),
        client_id: Yup.number().positive('Required').required('Required'),
        project_id: Yup.number(),
        start_ts: Yup.date().required('Required'),
        end_ts: Yup.date().min(Yup.ref('start_ts'), 'End must be after start').required('Required'),
        adjustment: Yup.number(),
        billable: Yup.boolean()
    });

    const [submitError, setSubmitError] = useState<string>('');
    const [clients, setClients] = useState<Database.IClient[]>([{id: -1, client_name: ''}]);
    const [projects, setProjects] = useState<Database.IProject[]>([{id: -1, project_name: ''}]);

    // Versions of start_ts and end_ts converted to UTC ISO format for when we save the time record in the database.
    const [utcStartTs, setUtcStartTs] = useState<string>();
    const [utcEndTs, setUtcEndTs] = useState<string>();

    // Get the clients for the select input once when the component mounts
    useEffect(() => {
        getClients()
            .then((clients: Database.IClient[]) => {
                setClients([{id: 0, client_name: ''}, ...clients]);
            })
            .catch(err => console.error(err));
    }, []);

    const submitForm = (values, {setSubmitting}) => {
        setSubmitError('');

        // Use the ISO start and end timestamps from state in the database since they're in UTC.
        let record = {...values, start_ts: utcStartTs, end_ts: utcEndTs}

        // If no project ID was selected, remove it from the values.
        if (record.project_id <= 0) {
            delete record.project_id;
        }

        createTimeRecord(record)
            .then(() => {
                onTimeRecordAdded();
            })
            .catch(err => {
                setSubmitError(err.message);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const cancelForm = () => {
        setSubmitError('');
        onCancel();
    };

    const formChanged = (values, touched) => {
        // When a client is selected, get the client's projects.
        if (touched.client_id) {
            getProjects(values.client_id)
                .then((projects: Database.IProject[]) => {
                    setProjects([{id: 0, project_name: ''}, ...projects]);
                })
                .catch(err => console.error(err));
        }

        // When start or end timestamp changes, convert them to what the database needs.
        if (touched.start_ts) {
            setUtcStartTs(isoLocalToUTC(values.start_ts));
        }

        if (touched.end_ts) {
            setUtcEndTs(isoLocalToUTC(values.end_ts));
        }
    };

    return (
        <Formik
            initialValues={initialFormState}
            onSubmit={submitForm}
            validationSchema={validationSchema}>
            {props => (
                <Form className={classNames('add-time-record-form', styles.base, className)}>
                    <FormObserver onFormChanged={formChanged} />
                    <div className='flex flex-row mb-4'>
                        <TextInput
                            name='work_description'
                            label='Work Description'
                            className='grow'
                            required
                            placeholder='Description of work being performed (e.g. Held meeting to understand business goals)' />
                    </div>

                    <div className='flex flex-row mb-4'>
                        <TextInput
                            name='invoice_activity'
                            label='Invoice Activity'
                            className='grow'
                            required
                            placeholder='Type of work to show on the invoice (e.g. Requirements Analysis)' />
                    </div>

                    <div className='flex flex-row mb-4 justify-items-stretch'>
                        <SelectInput
                            name='client_id'
                            label='Client'
                            className='w-1 grow mr-4'
                            required>
                            {clients && clients.map((client: Database.IClient) => (
                                <option key={client.id} value={client.id}>{client.client_name}</option>))}
                        </SelectInput>

                        <SelectInput
                            name='project_id'
                            className='w-1 grow'
                            label='Project'>
                            {projects && projects.map((project: Database.IProject) => (
                                <option key={project.id} value={project.id}>{project.project_name}</option>))}
                        </SelectInput>
                    </div>

                    <div className='flex flex-row mb-4'>
                        <DateTimeInput
                            name='start_ts'
                            className='mr-4'
                            label='Start'
                            required />

                        <DateTimeInput
                            name='end_ts'
                            className='mr-4'
                            label='End'
                            required />

                        <NumberInput
                            name='adjustment'
                            className='mr-4'
                            label='Adjustment (hours)'
                            step=".01"/>

                        <CheckboxInput
                            name='billable'
                            label='Billable?' />
                    </div>

                    {/*// TODO: Add Notes*/}

                    <div className='flex flex-row justify-end'>
                        <Button className='mr-1' disabled={!props.dirty || Object.keys(props.errors).length > 0 || props.isSubmitting} type='submit'>
                            Add Time Record
                        </Button>
                        <Button variant='secondary' disabled={props.isSubmitting} onClick={cancelForm}>Cancel</Button>
                    </div>

                    {submitError && <div className={classNames('submit-error', styles.error)}>{submitError}</div>}
                </Form>)}
        </Formik>
    )
}

const isoLocalToUTC = (local: string): string => {
    return DateTime.fromISO(local).toUTC().toString();
};

interface IFormObserverProps {
    onFormChanged?: (values, touched) => any;
}

const FormObserver = ({onFormChanged}: IFormObserverProps) => {
    const { values, touched } = useFormikContext();

    useEffect(() => {
        if (onFormChanged) onFormChanged(values, touched);
    }, [values, touched]);  return null;
};