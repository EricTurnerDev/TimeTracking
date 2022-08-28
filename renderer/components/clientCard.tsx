import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {deleteClient, getProjects, IClientTableProps} from '../lib/database';
import classNames from 'classnames';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import pluralize from '../lib/pluralize';

export interface IClientCardProps {
    client: IClientTableProps,
    onClientDeleted?: () => void;
    className?: string;
}

export default function ClientCard({client, onClientDeleted, className}: IClientCardProps) {

    const [numProjects, setNumProjects] = useState<number>(-1);

    useEffect(() => {
        if (client) {
            getProjects(client)
                .then(projects => {
                    setNumProjects(projects.length);
                })
                .catch(err => console.error(err));
        }
    }, [client])

    const trashIconClicked = () => {
        deleteClient(client).then(() => {
            if (onClientDeleted) {
                onClientDeleted();
            }
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <div className={classNames('client-card flex flex-col', className)}>
            <Link href={{pathname: `/client`, query: {id: client.id}}}>
                <a className='block flex-grow p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-blue-500'>
                    <h3 className='font-medium'>{client.client_name}</h3>
                </a>
            </Link>
            <div className='min-h-fit p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-gray-50 text-black'>
                {numProjects > -1 && <p className='mb-4'>{numProjects} {pluralize('project', numProjects)}</p>}
                <FontAwesomeIcon icon={faTrash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
            </div>
        </div>
    )
}
