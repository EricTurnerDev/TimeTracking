import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {deleteClient} from '../lib/database';
import classNames from 'classnames';

export interface IClientProps {
    id?: number;
    name: string;
    onClientDeleted?: () => void;
    className?: string;
}

export default function ClientCard({id, name, onClientDeleted, className}: IClientProps) {

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