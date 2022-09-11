/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import DataTable, {createTheme, TableColumn} from 'react-data-table-component';
import {Database} from 'timetracking-common';

import {Icon, gear} from '../../ui/Icon';
import P from '../../ui/text/P';
import * as db from '../../../lib/database';
import {darkTheme} from '../../../lib/dataTableThemes';

interface IProjectsDataTableProps {
    projects: Database.IProject[];
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const ProjectsDataTable = ({projects, className}: IProjectsDataTableProps) => {

    const projectNameChanged = async (row: Database.IProject, projectName) => {
        await db.updateProject(row.id, {id: row.id, project_name: projectName});
    };

    const columns: TableColumn<Database.IProject>[] = [
        {
            name: 'Project Name',
            selector: row => row.project_name,
            grow: 2,
            cell: row => <P editable={true} onSave={async (text) => projectNameChanged(row, text)} autoFocus={true}>{row.project_name}</P>
        },
        {
            name: '',
            sortable: false,
            cell: (row) => <MenuIcon row={row}/>,
            ignoreRowClick: true,
            width: '3rem'
        }
    ];

    return (
        <DataTable
            className={classNames(className)}
            columns={columns}
            data={projects}
            theme='timetrackingDark'
            highlightOnHover
            noTableHead
        />
    )
};

export default ProjectsDataTable;

interface IMenuIconProps {
    row: Database.IDetailedTimeRecord;
}

const MenuIcon = ({row}: IMenuIconProps) => {
    const clicked = (e) => {
        console.log(row.id);
    };

    return (
        <span className='hover:cursor-pointer'>
            <Icon onClick={clicked} icon={gear}/>
        </span>
    )
};

// TODO: When gear icon is clicked, show a context menu with the ability to delete the project.

const Menu = () => {
    return (
        <div></div>
    )
}