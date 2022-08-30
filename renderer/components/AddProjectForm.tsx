import {createProject, IClientTableProps, IProjectTableProps} from '../lib/database';
import {useEffect, useState} from 'react';
import {isBlank} from '../lib/isBlank';
import classNames from 'classnames';
import BaseInput from './ui/form/BaseInput';
import Button from './ui/Button';

export const initialFormState: IProjectTableProps = {
    project_name: '',
    client_id: -1,
};

export interface IAddProjectFormProps {
    className?: string;
    client: IClientTableProps,
    onProjectAdded: () => void;
}

export default function AddProjectForm({className, client, onProjectAdded}: IAddProjectFormProps) {
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (client) {
            setFormData(prevFormData => ({...prevFormData, client_id: client.id}));
        }
    }, [client])

    const buttonClicked = (e) => {
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

    const inputChanged = (e) => {
        setFormData(prevFormData => ({...prevFormData, project_name: e.target.value}));
    }

    const isValid = (formData: IProjectTableProps): boolean => {
        return !isBlank(formData.project_name);
    }

    return (
        <form className={classNames('add-project-form flex flex-row', className)}>
            <BaseInput
                className="w-full"
                id='project-name'
                placeholder='New project name'
                value={formData.project_name}
                onChange={inputChanged}/>

            <Button type='submit' disabled={adding || !isValid(formData)} onClick={buttonClicked}>Add Project</Button>
        </form>
    )
}