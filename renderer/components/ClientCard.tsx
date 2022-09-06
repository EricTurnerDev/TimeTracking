/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';

import {deleteClient, getProjects} from '../lib/database';
import H3 from './ui/text/H3';
import P from './ui/text/P';
import pluralize from '../lib/pluralize';
import Card from './ui/Card';
import {Icon, trash} from './ui/Icon';

export interface IClientCardProps {
    client: Database.IClient,
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
                     <a className='block w-full'><H3 className='font-medium'>{client.client_name}</H3></a>
                </Link>
            </Card.Header>
            <Card.Body>
                {numProjects > -1 && <P variant='dark'>{numProjects} {pluralize('project', numProjects)}</P>}
            </Card.Body>
            <Card.Footer>
                <P variant='dark'>
                    <Icon icon={trash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
                </P>
            </Card.Footer>
        </Card>
    )
}
