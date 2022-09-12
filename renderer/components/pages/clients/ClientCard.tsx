/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';

import Button from '../../ui/Button';
import Card from '../../ui/Card';
import {deleteClient, getProjects} from '../../../lib/database';
import H3 from '../../ui/text/H3';
import {Icon, trash, plus} from '../../ui/Icon';
import ProjectsDataTable from './ProjectsDataTable';

export interface IClientCardProps {
    client: Database.IClient,
    onClientDeleted?: () => void;
    className?: string;
}

export default function ClientCard({client, onClientDeleted, className}: IClientCardProps) {

    const [projects, setProjects] = useState<Database.IProject[]>([]);

    const showProjects = async () => {
        const projs: Database.IProject[] = await getProjects(client.id);
        setProjects(projs);
    }

    useEffect(() => {
        if (client) {
            getProjects(client.id)
                .then(projects => {
                    setProjects(projects);
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

    const projectDeleted = () => {
        showProjects().catch(err => console.error(err));
    }

    return (
        <Card className={classNames('client-card', className)}>
            <Card.Header>
                <H3 className='font-medium'>{client.client_name}</H3>
                <Icon icon={trash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
            </Card.Header>
            <Card.Body>
                <ProjectsDataTable projects={projects} onDelete={projectDeleted} />
            </Card.Body>
            <Card.Footer className='flex flex-row justify-end bg-gray-900'>
                <Button variant='clear'><Icon icon={plus} /> New Project</Button>
            </Card.Footer>
        </Card>
    )
}
