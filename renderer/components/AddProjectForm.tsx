import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';

import BaseInput from './ui/form/BaseInput';
import Button from './ui/Button';
import {createProject} from '../lib/database';
import isBlank from '../lib/isBlank';

export const initialFormState: Database.IProject = {
    project_name: '',
    client_id: -1,
};

export interface IAddProjectFormProps {
    className?: string;
    client: Database.IClient,
    onProjectAdded: () => void;
    onCancel: () => void;
}

export default function AddProjectForm({className, client, onProjectAdded, onCancel}: IAddProjectFormProps) {
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (client) {
            setFormData(prevFormData => ({...prevFormData, client_id: client.id}));
        }
    }, [client])

    const addButtonClicked = (e) => {
        setAdding(true);
        createProject(formData).
        then(() => {
            onProjectAdded();
            setFormData(prevFormData => ({...prevFormData, project_name: ''}));
        }).catch(e => {
            // TODO: Show error to the user.
            console.error(e);
        }).
        finally(() => {
            setAdding(false);
        });
    }

    const cancelButtonClicked = () => {
        setFormData(initialFormState);
        setAdding(false);
        onCancel();
    }

    const inputChanged = (e) => {
        setFormData(prevFormData => ({...prevFormData, project_name: e.target.value}));
    }

    const isValid = (formData: Database.IProject): boolean => {
        return !isBlank(formData.project_name);
    }

    return (
        <form className={classNames('add-project-form flex flex-row', className)}>
            <BaseInput
                className='w-full mr-1'
                id='project-name'
                placeholder='New project name'
                value={formData.project_name}
                onChange={inputChanged}/>

            <Button className='mr-1' type='submit' disabled={adding || !isValid(formData)} onClick={addButtonClicked}>Add Project</Button>
            <Button variant='secondary' disabled={adding} onClick={cancelButtonClicked}>Cancel</Button>
        </form>
    )
}