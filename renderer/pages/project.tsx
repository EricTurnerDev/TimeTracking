import Head from 'next/head';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import H1 from '../components/ui/text/H1';
import {parseIntQueryParam} from '../lib/parseQueryParam';
import * as db from '../lib/database';
import {IClientTableProps, IProjectTableProps, ITimeRecordTableProps} from "../lib/database";

export default function Project() {
    const router = useRouter();
    const {id: projectId} = router.query;
    const [project, setProject] = useState<db.IProjectTableProps>();
    const [client, setClient] = useState<db.IClientTableProps>();
    const [timeRecords, setTimeRecords] = useState<db.ITimeRecordTableProps[]>([]);

    // Get the project
    useEffect(() => {
        if (projectId) {
            const ids: number[] = parseIntQueryParam(projectId);
            if (ids.length > 0) {
                db.getProject(ids[0])
                    .then((prj: IProjectTableProps) => {
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
                .then((cl: IClientTableProps) => {
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
                .then((trs: ITimeRecordTableProps[]) => {
                    setTimeRecords(trs);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [project]);

    return (
        <div className='project'>
            <Head>
                <title>Project - TimeKeeping</title>
            </Head>
            {project && client && <H1>{project.project_name} for {client.client_name}</H1>}

            {timeRecords && timeRecords.map((tr: ITimeRecordTableProps) => (<p key={tr.id}>{tr.work_description}</p>))}
        </div>
    )
}
