import classNames from 'classnames';
import {useState} from 'react';

import BaseInput from './form/BaseInput';
import Button from './form/Button';
import {createClient, IClientTableProps} from '../lib/database';
import {isBlank} from '../lib/isBlank';

export const initialFormState: IClientTableProps = {
    client_name: '',
};

export interface IAddClientFormProps {
    className?: string;
    onClientAdded: () => void;
}

export default function AddClientForm({className, onClientAdded}: IAddClientFormProps) {
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
            <BaseInput
                id='client-name'
                className='w-full'
                placeholder='New client name'
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}/>

            <Button disabled={adding || !isValid(formData)} onClick={buttonClicked}>Add Client</Button>
        </form>
    )
}