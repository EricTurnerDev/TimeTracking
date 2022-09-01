import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Database} from 'timetracking-common';

import * as db from '../lib/database';
import {parseIntQueryParam} from '../lib/parseQueryParam';
import Grid from '../components/ui/Grid';
import ProjectCard from '../components/ProjectCard';
import AddProjectForm from '../components/AddProjectForm';
import H1 from '../components/ui/text/H1';
import H2 from '../components/ui/text/H2';

export default function Client() {
    const router = useRouter();
    const {id: clientId} = router.query;
    const [client, setClient] = useState<Database.IClient>();
    const [projects, setProjects] = useState<Database.IProject[]>();

    // Get the client
    useEffect(() => {
        if (clientId) {
            const id:number[] = parseIntQueryParam(clientId);
            if (id.length > 0) {
                db.getClient(id[0])
                    .then((cl: Database.IClient) => {
                        setClient(cl)
                    })
                    .catch(err => {
                        console.error(err)
                    });
            }
        }
    }, [clientId])

    // Get the projects for a client
    useEffect(() => {
        if (clientId) {
            const id:number[] = parseIntQueryParam(clientId);
            if (id.length > 0) {
                db.getProjects(id[0])
                    .then((projects) => {
                        setProjects(projects);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }, [clientId]);

    const showProjects = async () => {
        const result: Database.IProject[] = await db.getProjects(client.id);
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
                {projects && projects.map((project: Database.IProject) => {
                    return (
                        <ProjectCard key={project.id} project={project} onProjectDeleted={projectDeleted}/>
                    )
                })}
            </Grid>
        </div>
    )
}

function hasProjects(projects: Database.IProject[]) {
    return projects && projects.length > 0;
}