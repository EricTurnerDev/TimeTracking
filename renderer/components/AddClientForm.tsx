import classNames from 'classnames';
import {useState} from 'react';
import {Database} from 'timetracking-common';

import BaseInput from './ui/form/BaseInput';
import Button from './ui/Button';
import {createClient} from '../lib/database';
import isBlank from '../lib/isBlank';

const initialFormState: Database.IClient = {
    client_name: '',
};

interface IAddClientFormProps {
    className?: string;
    onClientAdded: () => void;
    onCancel: () => void;
}

export default function AddClientForm({className, onClientAdded, onCancel}: IAddClientFormProps) {
    const [adding, setAdding] = useState<boolean>(false);
    const [formData, setFormData] = useState<Database.IClient>(initialFormState);

    const addButtonClicked = () => {
        setAdding(true);
        createClient(formData).
        then(() => {
            setFormData(initialFormState);
            onClientAdded();
        }).catch(e => {
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

    const isValid = (formData: Database.IClient): boolean => {
        return !isBlank(formData.client_name);
    }

    return (
        <form className={classNames('add-client-form flex flex-row', className)}>
            <BaseInput
                id='client-name'
                className='w-full mr-1'
                placeholder='New client name'
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}/>

            <Button className='mr-1' type='submit' disabled={adding || !isValid(formData)} onClick={addButtonClicked}>Add Client</Button>
            <Button variant='secondary' disabled={adding} onClick={cancelButtonClicked}>Cancel</Button>
        </form>
    )
}