import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import * as db from '../lib/database';
import {IClientTableProps, IProjectTableProps} from '../lib/database';
import Grid from '../components/grid';
import ProjectCard from '../components/projectCard';
import AddProjectForm from '../components/addProjectForm';

export default function Client() {
    const {query} = useRouter();
    const [client, setClient] = useState<IClientTableProps>();
    const [projects, setProjects] = useState<IProjectTableProps[]>();

    useEffect(() => {
        const id = parseId(query.id);
        db.getClient({id})
            .then((cl: IClientTableProps) => {
                setClient(cl)
            })
            .catch(err => {
                console.error(err)
            });
    }, [query.id])

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

            {client && <h1 className='mb-4'>{client.client_name}</h1>}

            <AddProjectForm className='mb-4' client={client} onProjectAdded={projectAdded} />

            {hasProjects(projects) && <h2 className="mb-4">Projects</h2>}
            {!hasProjects(projects) && <h2>There are no projects for this client.</h2>}

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

function parseId(id: string | string[]) {
    return parseInt(typeof id === 'string' ? id : id[0]);
}

function hasProjects(projects: db.IProjectTableProps[]) {
    return projects && projects.length > 0;
}