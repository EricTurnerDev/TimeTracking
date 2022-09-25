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
import {DatabaseInterfaces} from 'timetracking-common';

import AddProjectForm from './AddProjectForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {deleteClient, getProjects} from '@/lib/database';
import {Icon, trash, plus} from '@/components/ui/Icon';
import ProjectsDataTable from './ProjectsDataTable';
import * as db from "@/lib/database";
import InlineEditText from '@/components/ui/inline-editing/InlineEditText';

export interface IClientCardProps {
    client: DatabaseInterfaces.IClient,
    onClientDeleted?: () => void;
    className?: string;
}

export default function ClientCard({client, onClientDeleted, className}: IClientCardProps) {

    const [projects, setProjects] = useState<DatabaseInterfaces.IProject[]>([]);
    const [addingProject, setAddingProject] = useState<boolean>(false);

    const updateProjects = async () => {
        if (client) {
            const projs: DatabaseInterfaces.IProject[] = await getProjects({clientId: client.id});
            setProjects(projs);
        }
    }

    useEffect(() => {
        updateProjects().catch(err => console.error(err));
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

    const newProjectButtonClicked = () => {
        setAddingProject(true);
    };

    const cancelButtonClicked = () => {
        setAddingProject(false);
    };

    const projectAdded = () => {
        updateProjects()
            .catch(err => console.error(err))
            .finally(() => setAddingProject(false));
    };

    const projectDeleted = () => {
        updateProjects().catch(err => console.error(err));
    }

    const clientNameChanged = async (clientName) => {
        await db.updateClient(client.id, {client_name: clientName});
    };

    return (
        <Card className={classNames('client-card', className)}>
            <Card.Header className='justify-between'>
                <InlineEditText
                    as='h3'
                    className='font-medium'
                    autoFocus={true}
                    onSave={clientNameChanged}>
                    {client.client_name}
                </InlineEditText>
                <Icon icon={trash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
            </Card.Header>
            <Card.Body>
                <ProjectsDataTable projects={projects} onDelete={projectDeleted}/>
            </Card.Body>
            <Card.Footer className='flex flex-col bg-gray-900'>
                <div className='flex flex-row justify-end'>
                    <Button variant='clear' onClick={newProjectButtonClicked}>
                        <Icon icon={plus}/> New Project
                    </Button>
                </div>
                {addingProject &&
                    <div className='p-4'>
                        <AddProjectForm client={client} onProjectAdded={projectAdded} onCancel={cancelButtonClicked}/>
                    </div>
                }
            </Card.Footer>
        </Card>
    )
}
