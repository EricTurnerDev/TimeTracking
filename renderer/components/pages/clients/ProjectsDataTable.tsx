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

import * as db from '../../../lib/database';
import {darkTheme} from '../../../lib/dataTableThemes';
import {RowActions} from '../DataTableRowActions';
import InlineEditText from '../../ui/inline-editing/InlineEditText';

interface IProjectsDataTableProps {
    projects: Database.IProject[];
    onDelete: () => any;
    className?: string;
}

createTheme('timetrackingDark', darkTheme, 'dark');

const ProjectsDataTable = ({projects, onDelete, className}: IProjectsDataTableProps) => {

    const projectNameChanged = async (row: Database.IProject, projectName) => {
        await db.updateProject(row.id, {id: row.id, project_name: projectName});
    };

    const columns: TableColumn<Database.IProject>[] = [
        {
            name: 'Project Name',
            selector: row => row.project_name,
            grow: 2,
            cell: row => <InlineEditText onSave={async (text) => projectNameChanged(row, text)} autoFocus={true}>{row.project_name}</InlineEditText>
        },
        {
            name: '',
            sortable: false,
            cell: (row) => <RowActions row={row} deleteRow={(rowId) => db.deleteProject(rowId)} onDelete={onDelete}/>,
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