import classNames from 'classnames';
import Link from 'next/link';
import {Database} from 'timetracking-common';

import {deleteProject} from '../lib/database';
import H3 from './ui/text/H3';
import P from './ui/text/P';
import Card from './ui/Card';
import {Icon, trash} from './ui/Icon';

export interface IProjectCardProps {
    project: Database.IProject,
    onProjectDeleted?: () => void;
    className?: string;
}

export default function ProjectCard({project, onProjectDeleted, className}: IProjectCardProps) {
    const trashIconClicked = () => {
        deleteProject(project.id).then(() => {
            if (onProjectDeleted) {
                onProjectDeleted();
            }
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <Card className={classNames('project-card', className)}>
            <Card.Header>
                <Link href={{pathname: `/project`, query: {id: project.id}}}>
                    <a><H3 className='font-medium'>{project.project_name}</H3></a>
                </Link>
            </Card.Header>
            <Card.Footer>
                <P variant='dark'>
                    <Icon icon={trash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
                </P>
            </Card.Footer>
        </Card>
    )
}