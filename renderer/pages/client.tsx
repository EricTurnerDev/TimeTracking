import Head from "next/head";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import * as db from '../lib/database';
import {IClientTableProps, IProjectTableProps} from "../lib/database";

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

    return (
        <div className="client">
            <Head>
                <title>Client - TimeTracking</title>
            </Head>
            {client && <h1>{client.client_name}</h1>}
            {projects && projects.map(project => (<p key={project.id}>{project.project_name}</p>))}
        </div>
    )
}

function parseId(id: string | string[]) {
    return parseInt(typeof id === 'string' ? id : id[0]);
}