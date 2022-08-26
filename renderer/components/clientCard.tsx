import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {createClient, deleteClient, IClientTableProps} from '../lib/database';
import classNames from 'classnames';
import {useState} from 'react';
import {isBlank} from '../lib/isBlank';
import {Button, Input} from './form';

export interface IClientProps {
    id?: number;
    name: string;
    onClientDeleted?: () => void;
    className?: string;
}

export function ClientCard({id, name, onClientDeleted, className}: IClientProps) {

    const trashIconClicked = () => {
        deleteClient({id}).
        then(() => {
            if (onClientDeleted) {
                onClientDeleted();
            }
        }).catch(err => {
            // TODO: Show error to the user.
            console.error(err);
        });
    }

    return (
        <div className={classNames('client p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-blue-500 rounded', className)}>
            <p>{name} <FontAwesomeIcon icon={faTrash} onClick={trashIconClicked}/></p>
        </div>
    )
}

export const initialFormState: IClientTableProps = {
    client_name: '',
};

export interface IAddClientFormProps {
    className?: string;
    onClientAdded: () => void;
}

export function AddClientForm({className, onClientAdded}: IAddClientFormProps) {
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    const buttonClicked = (e) => {
        setAdding(true);
        createClient(formData).
        then(() => {
            onClientAdded();
            setFormData(initialFormState);
        }).catch(e => {
            // TODO: Show error to the user.
            console.error(e);
        }).
        finally(() => {
            setAdding(false);
        });
    }

    const isValid = (formData: IClientTableProps): boolean => {
        return !isBlank(formData.client_name);
    }

    return (
        <form className={classNames('add-client-form flex flex-row', className)}>
            <Input type='text'
                   id='client-name'
                   placeholder='New client name'
                   value={formData.client_name}
                   onChange={(e) => setFormData({...formData, client_name: e.target.value})}/>

            <Button disabled={adding || !isValid(formData)} onClick={buttonClicked}>Add Client</Button>
        </form>
    )
}