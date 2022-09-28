/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';

interface IActivitySummaryProps {
    hours?: number;
    billableHours?: number;
    nonBillableHours?: number;
    numClients?: number;
    numProjects?: number;
    title: string;
    className?: string;
}

const ActivitySummary = ({hours=0, billableHours=0, nonBillableHours=0, numClients=0, numProjects=0, title, className}: IActivitySummaryProps) => {

    return (
        <div className={classNames('activity-summary', 'border-gray-500 border rounded p-4', className)}>
            <h1 className='mb-2'>{title}</h1>
            <div className='flex flex-row justify-between'>
                <div className='p-4'>
                    <h2 className='mb-4'>Billable:</h2>
                    <p className='text-green-500'>{billableHours} hours</p>
                </div>
                <div className='p-4'>
                    <h2 className='mb-4'>Non-Billable:</h2>
                    <p className='text-green-500'>{nonBillableHours} hours</p>
                </div>
                <div className='p-4'>
                    <h2 className='mb-4'>Total:</h2>
                    <p className='text-green-500'>{hours} hours</p>
                </div>
                <div className='p-4'>
                    <h2 className='mb-4'>Clients:</h2>
                    <p className='text-green-500'>{numClients}</p>
                </div>
                <div className='p-4'>
                    <h2 className='mb-4'>Projects:</h2>
                    <p className='text-green-500'>{numProjects}</p>
                </div>
            </div>
        </div>
    )
};

export default ActivitySummary;