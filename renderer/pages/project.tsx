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

    useEffect(() => {
        if (projectId) {
            const ids: number[] = parseIntQueryParam(projectId);
            if (ids.length > 0) {
                db.getProject({id: ids[0]})
                    .then((prj: IProjectTableProps) => {
                        setProject(prj);
                    })
                    .catch(err => {
                        console.error(err)
                    });
            }
        }
    }, [projectId]);

    useEffect(() => {
        if (project) {
            db.getClient({id: project.client_id})
                .then((cl: IClientTableProps) => {
                    setClient(cl);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [project]);

    useEffect(() => {
        if (client || project) {
            db.getTimeRecords(client, project)
                .then((trs: ITimeRecordTableProps[]) => {
                    setTimeRecords(trs);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [client, project]);

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
