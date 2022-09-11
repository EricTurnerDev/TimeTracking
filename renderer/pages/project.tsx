/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Head from 'next/head';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Database} from 'timetracking-common';

import H1 from '../components/ui/text/H1';
import {parseIntQueryParam} from '../lib/parseQueryParam';
import * as db from '../lib/database';


export default function Project() {
    const router = useRouter();
    const {id: projectId} = router.query;
    const [project, setProject] = useState<Database.IProject>();
    const [client, setClient] = useState<Database.IClient>();
    const [timeRecords, setTimeRecords] = useState<Database.ITimeRecord[]>([]);

    // Get the project
    useEffect(() => {
        if (projectId) {
            const ids: number[] = parseIntQueryParam(projectId);
            if (ids.length > 0) {
                db.getProject(ids[0])
                    .then((prj: Database.IProject) => {
                        setProject(prj);
                    })
                    .catch(err => {
                        console.error(err)
                    });
            }
        }
    }, [projectId]);

    // Get client of this project
    useEffect(() => {
        if (project) {
            db.getClient(project.client_id)
                .then((cl: Database.IClient) => {
                    setClient(cl);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [project]);

    // Get the time records for the project.
    useEffect(() => {
        if (project) {
            db.getTimeRecords({projectId: project?.id})
                .then((trs: Database.ITimeRecord[]) => {
                    setTimeRecords(trs);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [project]);

    const updateProjectName = async (projectName: string): Promise<void> => {
        await db.updateProject(project.id, {project_name: projectName});
        setProject((prevState: Database.IProject) => ({...prevState, project_name: projectName}));
    };

    return (
        <div className='project'>
            <Head>
                <title>Project - TimeKeeping</title>
            </Head>
            {project && <H1 editable={true} onSave={updateProjectName}>{project.project_name}</H1>}

            {timeRecords && timeRecords.map((tr: Database.ITimeRecord) => (<p key={tr.id}>{tr.description}</p>))}
        </div>
    )
}
