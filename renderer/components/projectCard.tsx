import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {deleteProject, IProjectTableProps} from '../lib/database';
import classNames from 'classnames';
import Link from 'next/link';

export interface IProjectCardProps {
    project: IProjectTableProps,
    onProjectDeleted?: () => void;
    className?: string;
}

export default function ProjectCard({project, onProjectDeleted, className}: IProjectCardProps) {
    const trashIconClicked = () => {
        deleteProject(project).then(() => {
            if (onProjectDeleted) {
                onProjectDeleted();
            }
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <div className={classNames('project-card flex flex-col', className)}>

            <Link href={{pathname: `/project`, query: {id: project.id}}}>
                <a className='block flex-grow p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-blue-500'>
                    <h3 className='font-medium'>{project.project_name}</h3>
                </a>
            </Link>
            <div className='min-h-fit p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-gray-50 text-black'>
                <FontAwesomeIcon icon={faTrash} className='hover:cursor-pointer' onClick={trashIconClicked}/>
            </div>
        </div>
    )
}