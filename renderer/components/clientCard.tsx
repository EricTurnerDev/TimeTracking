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
        <div className={classNames('client-card flex flex-col', className)}>
            <h3 className="flex-grow p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 font-medium bg-blue-500">
                {name}
            </h3>
            <div className="min-h-fit p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-gray-50 text-black">
                <FontAwesomeIcon icon={faTrash} className="hover:cursor-pointer" onClick={trashIconClicked}/>
            </div>
        </div>
    )
}