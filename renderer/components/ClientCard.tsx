import classNames from 'classnames';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {deleteClient, getProjects, IClientTableProps} from '../lib/database';
import H3 from './ui/text/H3';
import P from './ui/text/P';
import pluralize from '../lib/pluralize';
import Card from './ui/Card';

export interface IClientCardProps {
    client: IClientTableProps,
    onClientDeleted?: () => void;
    className?: string;
}

export default function ClientCard({client, onClientDeleted, className}: IClientCardProps) {

    const [numProjects, setNumProjects] = useState<number>(-1);

    useEffect(() => {
        if (client) {
            getProjects(client.id)
                .then(projects => {
                    setNumProjects(projects.length);
                })
                .catch(err => console.error(err));
        }
    }, [client])

    const trashIconClicked = () => {
        deleteClient(client.id).then(() => {
            if (onClientDeleted) {
                onClientDeleted();
            }
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <Card className={classNames('client-card', className)}>
            <Card.Header>
                 <Link href={{pathname: `/client`, query: {id: client.id}}}>
                     <a><H3 className='font-medium'>{client.client_name}</H3></a>
                </Link>
            </Card.Header>
            <Card.Body>
                {numProjects > -1 && <P variant='dark'>{numProjects} {pluralize('project', numProjects)}</P>}
            </Card.Body>
            <Card.Footer>
                <P variant='dark'>
                    <FontAwesomeIcon icon={faTrash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
                </P>
            </Card.Footer>
        </Card>
    )
}
