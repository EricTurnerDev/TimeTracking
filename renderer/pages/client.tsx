import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import * as db from '../lib/database';
import {IClientTableProps, IProjectTableProps} from '../lib/database';
import Grid from '../components/Grid';
import ProjectCard from '../components/ProjectCard';
import AddProjectForm from '../components/AddProjectForm';
import H1 from '../components/ui/text/H1';
import H2 from '../components/ui/text/H2';

export default function Client() {
    const router = useRouter();
    const {id: clientId} = router.query;
    const [client, setClient] = useState<IClientTableProps>();
    const [projects, setProjects] = useState<IProjectTableProps[]>();

    useEffect(() => {
        if (clientId) {
            const id = parseIntQueryParam(clientId);
            db.getClient({id})
                .then((cl: IClientTableProps) => {
                    setClient(cl)
                })
                .catch(err => {
                    console.error(err)
                });
        }
    }, [clientId])

    useEffect(() => {
        if (client) {
            db.getProjects(client)
                .then((projects) => {
                    setProjects(projects);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [client]);

    const showProjects = async () => {
        const result: db.IProjectTableProps[] = await db.getProjects(client);
        setProjects(result);
    };

    const projectDeleted = () => {
        showProjects().catch(err => console.error(err));
    }

    const projectAdded = () => {
        showProjects().catch(err => console.error(err));
    }

    return (
        <div className='client'>
            <Head>
                <title>Client - TimeTracking</title>
            </Head>

            {client && <H1 className='mb-4'>{client.client_name}</H1>}

            <AddProjectForm className='mb-4' client={client} onProjectAdded={projectAdded} />

            {hasProjects(projects) && <H2 className="mb-4">Projects</H2>}
            {!hasProjects(projects) && <H2>There are no projects for this client.</H2>}

            <Grid>
                {projects && projects.map((project: db.IProjectTableProps) => {
                    return (
                        <ProjectCard key={project.id} project={project} onProjectDeleted={projectDeleted}/>
                    )
                })}
            </Grid>
        </div>
    )
}

/**
 * Query param can be a string or an array of strings. Convert the string to an integer, or convert the first
 * element of the array from a string to an integer.
 */
function parseIntQueryParam(id: string | string[]) {
    return parseInt(typeof id === 'string' ? id : id[0]);
}

function hasProjects(projects: db.IProjectTableProps[]) {
    return projects && projects.length > 0;
}