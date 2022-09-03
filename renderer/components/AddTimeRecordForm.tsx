import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';
import {DateTime} from 'luxon';

import BaseInput from './ui/form/BaseInput';
import BaseSelect from './ui/form/BaseSelect';
import Button from './ui/Button';
import {createTimeRecord, getClients, getProjects} from '../lib/database';
import isBlank from '../lib/isBlank';

const initialFormState: Database.ITimeRecord = {
    invoice_activity: '',
    work_description: '',
    client_id: -1,
    start_ts: '',
    end_ts: '',
    adjustment: 0.0,
    billable: false,
};

interface IAddTimeRecordFormProps {
    className?: string;
    onTimeRecordAdded: () => void;
    onCancel?: () => void;
}

const styles = {
    base: 'p-4'
};

export default function AddTimeRecordForm({onTimeRecordAdded, onCancel, className}: IAddTimeRecordFormProps) {

    const [adding, setAdding] = useState<boolean>(false);
    const [formData, setFormData] = useState<Database.ITimeRecord>(initialFormState);
    const [clients, setClients] = useState<Database.IClient[]>([{id: -1, client_name: ''}]);
    const [projects, setProjects] = useState<Database.IProject[]>([{id: -1, project_name: ''}]);

    // Versions of start_ts and end_ts converted to UTC ISO format for when we save the time record in the database.
    const [startTs, setStartTs] = useState<string>();
    const [endTs, setEndTs] = useState<string>();

    // Get the clients only once
    useEffect(() => {
        getClients()
            .then((clients: Database.IClient[]) => {
                setClients([{id: -1, client_name: ''}, ...clients]);
            })
            .catch(err => console.error(err));
    }, []);

    // Get the projects for whatever client is selected
    useEffect(() => {
        if (formData.client_id) {
            getProjects(formData.client_id)
                .then((projects: Database.IProject[]) => {
                    setProjects([{id: -1, project_name: ''}, ...projects]);
                })
                .catch(err => console.error(err));
        }
    }, [formData.client_id]);

    // When start_ts or end_ts changes, convert to the ISO UTC format used in the database and save it in state.
    useEffect(() => {
        if (formData.start_ts) {
            setStartTs(isoLocalToUTC(formData.start_ts));
        }
        if (formData.end_ts) {
            setEndTs(isoLocalToUTC(formData.end_ts));
        }
    }, [formData.start_ts, formData.end_ts]);

    const isoLocalToUTC = (local: string): string => {
        return DateTime.fromISO(local).toUTC().toString();
    };

    const isValid = (formData: Database.ITimeRecord) => {
        return !isBlank(formData.work_description) &&
            !isBlank(formData.invoice_activity) &&
            formData.client_id >= 0 &&
            (formData.project_id >= 0 || !formData.project_id) &&
            !isBlank(formData.start_ts) &&
            !isBlank(formData.end_ts);

        // TODO: Check that end_ts is on or after start_ts
    };

    const addButtonClicked = () => {
        setAdding(true);
        // Use the ISO start and end timestamps from state in the database since they're in UTC.
        createTimeRecord({...formData, start_ts: startTs, end_ts: endTs})
            .then(() => {
                setFormData(initialFormState);
                onTimeRecordAdded();
            })
            .catch(err => console.error(err))
            .finally(() => {
                setAdding(false);
            });
    };

    const cancelButtonClicked = () => {
        setFormData(initialFormState);
        setAdding(false);
        onCancel();
    }

    return (
        <form className={classNames('add-time-record-form', styles.base, className)}>
            <div className='flex flex-row mb-4'>
                <BaseInput
                    id='work-description'
                    className='grow'
                    label='Work Description'
                    required
                    placeholder='Description of work being performed (e.g. Held meeting to understand business goals)'
                    value={formData.work_description}
                    onChange={(e) => setFormData({...formData, work_description: e.target.value})}/>
            </div>

            <div className='flex flex-row mb-4'>
                <BaseInput
                    id='invoice-activity'
                    className='grow'
                    label='Invoice Activity'
                    required
                    placeholder='Type of work to show on the invoice (e.g. Requirements Analysis)'
                    value={formData.invoice_activity}
                    onChange={(e) => setFormData({...formData, invoice_activity: e.target.value})}/>
            </div>

            <div className='flex flex-row mb-4 justify-items-stretch'>
                <BaseSelect
                    id='client-id'
                    className='w-1 grow mr-4'
                    label='Client'
                    required
                    value={formData.client_id}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                    {clients && clients.map((client: Database.IClient) => (
                        <option key={client.id} value={client.id}>{client.client_name}</option>))}
                </BaseSelect>

                <BaseSelect
                    id='project-id'
                    className='w-1 grow'
                    label='Project'
                    value={formData.project_id}
                    onChange={(e) => {
                        const pid = e.target.value;
                        // Project id >= 0 means a valid project was selected.
                        setFormData({...formData, project_id: pid >= 0 ? pid : undefined})
                    }}>
                    {projects && projects.map((project: Database.IProject) => (
                        <option key={project.id} value={project.id}>{project.project_name}</option>))}
                </BaseSelect>
            </div>

            <div className='flex flex-row mb-4'>
                <BaseInput
                    id='start-date-time'
                    className='mr-4'
                    type='datetime-local'
                    label='Start'
                    required
                    value={formData.start_ts}
                    onChange={(e) => setFormData({...formData, start_ts: e.target.value})}/>

                <BaseInput
                    id='end-date-time'
                    className='mr-4'
                    type='datetime-local'
                    label='End'
                    required
                    value={formData.end_ts}
                    onChange={(e) => setFormData({...formData, end_ts: e.target.value})}/>

                <BaseInput
                    id='adjustment'
                    className='mr-4'
                    type='number'
                    label='Adjustment (hours)'
                    step=".01"
                    value={formData.adjustment}
                    onChange={(e) => setFormData({...formData, adjustment: e.target.value})}/>

                <BaseInput
                    id='billable'
                    type='checkbox'
                    label='Billable?'
                    value={formData.billable}
                    onChange={(e) => setFormData({...formData, billable: e.target.checked})}/>
            </div>

            {/*// TODO: Add Notes*/}

            <div className='flex flex-row justify-end mt-6'>
                <Button className='mr-1' type='submit' disabled={adding || !isValid(formData)}
                        onClick={addButtonClicked}>Add Time
                    Record</Button>
                <Button variant='secondary' onClick={cancelButtonClicked}>Cancel</Button>
            </div>
        </form>
    )
}