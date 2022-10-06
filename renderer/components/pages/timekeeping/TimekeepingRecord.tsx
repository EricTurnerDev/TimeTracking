/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {DatabaseInterfaces} from 'timetracking-common';
import {useEffect, useState} from 'react';
import {DateTime} from 'luxon';

import * as db from '@/lib/database';
import {localISOToUTCISO} from '@/lib/dateTimeConversion';
import {Icon, clone, trash} from '@/components/ui/Icon';
import InlineEditDateTime from '@/components/ui/inline-editing/InlineEditDateTime';
import InlineEditSelect from '@/components/ui/inline-editing/InlineEditSelect';
import InlineEditText from '@/components/ui/inline-editing/InlineEditText';
import InlineEditToggle from '@/components/ui/inline-editing/InlineEditToggle';
import NonEmptyArray from '@/lib/types/NonEmptyArray';
import pluralize from '@/lib/pluralize';
import SelectOption from '@/lib/types/SelectOption';


interface ITimekeepingRecordProps {
    record: DatabaseInterfaces.IDetailedTimeRecord;
    clients: DatabaseInterfaces.IClient[];
    recordDeleted: (number) => void;
    recordCloned: (number) => void;
    className?: string;
}

const emptyOption: SelectOption = {value: '', text: ''};

const TimekeepingRecord = ({record, clients, recordDeleted, recordCloned, className}: ITimekeepingRecordProps) => {
    const [timeRecord, setTimeRecord] = useState<DatabaseInterfaces.IDetailedTimeRecord>(record);
    const [clientSelectOptions, setClientSelectOptions] = useState<NonEmptyArray<SelectOption>>([emptyOption]);
    const [projectSelectOptions, setProjectSelectOptions] = useState<NonEmptyArray<SelectOption>>([emptyOption]);

    useEffect(() => {
        const opts = createClientSelectOptions(clients);
        setClientSelectOptions(opts);
    }, [clients]);

    // Update the available project options if the client changes
    useEffect(() => {
        const fn = async () => {
            const projects = await db.getProjects({clientId: timeRecord.client_id});
            const opts = createProjectSelectOptions(projects);
            setProjectSelectOptions(opts);
        }
        fn().catch(err => console.error(err));
    }, [timeRecord.client_id]);

    const styles = {
        base: 'border border-gray-500 rounded p-4'
    };

    const billableChanged = async (billable) => {
        try {
            await db.updateTimeRecord({id: record.id, billable});
            setTimeRecord(prev => ({...prev, billable}));
        } catch (err) {
            console.error(err);
        }
    };

    const clientChanged = async (option: SelectOption) => {
        const client_id = parseInt(option.value);
        const project_id = null;
        try {
            await db.updateTimeRecord({id: record.id, client_id, project_id});
            setTimeRecord(prev => ({...prev, client_id, client_name: option.text, project_id, project_name: ''}));
        } catch (err) {
            console.error(err);
        }
    };

    const descriptionChanged = async (description) => {
        try {
            await db.updateTimeRecord({id: timeRecord.id, description: description});
            setTimeRecord(prev => ({...prev, description}));
        } catch (err) {
            console.error(err);
        }
    };

    const endDateTimeChanged = async (localISODateTime: string) => {
        const end_ts = localISOToUTCISO(localISODateTime);
        try {
            await db.updateTimeRecord({id: record.id, end_ts});
            const [{hours}] = await db.getHours(timeRecord.start_ts, end_ts, timeRecord.adjustment || 0);
            setTimeRecord(prev => ({...prev, end_ts, hours}));
        } catch (err) {
            console.error(err);
        }
    };

    const projectChanged = async (option: SelectOption) => {
        const project_id = parseInt(option.value);
        try {
            await db.updateTimeRecord({id: record.id, project_id});
            setTimeRecord(prev => ({...prev, project_id, project_name: option.text}));
        } catch (err) {
            console.error(err);
        }
    };

    const startDateTimeChanged = async (localISODateTime: string) => {
        const start_ts = localISOToUTCISO(localISODateTime);
        try {
            await db.updateTimeRecord({id: record.id, start_ts});
            const [{hours}] = await db.getHours(start_ts, timeRecord.end_ts, timeRecord.adjustment || 0);
            setTimeRecord(prev => ({...prev, start_ts, hours}));
        } catch (err) {
            console.error(err);
        }
    };

    const createClientSelectOptions = (clients: DatabaseInterfaces.IClient[]): NonEmptyArray<SelectOption> => {
        const c = clients.map(client => ({
            value: client.id.toString(),
            text: client.client_name
        }));
        return [emptyOption, ...c];
    };

    const createProjectSelectOptions = (projects: DatabaseInterfaces.IProject[]): NonEmptyArray<SelectOption> => {
        const p = projects.map(project => ({
            value: project.id.toString(),
            text: project.project_name
        }));
        return [emptyOption, ...p];
    };

    const deleteRecord = () => {
        db.deleteTimeRecord(record.id)
            .then(() => recordDeleted(record.id))
            .catch(err => console.error(err));
    };

    const cloneRecord = () => {
        // Create a new time record from the existing one
        const rec: DatabaseInterfaces.ITimeRecord = (({description, client_id, project_id, billable}) => ({
            description,
            client_id,
            project_id,
            billable,
            start_ts: DateTime.utc().toISO(),
        }))(record);

        db.createTimeRecord(rec)
            .then(() => recordCloned(record.id))
            .catch(err => console.error(err));
    }

    return (
        <div className={classNames('timekeeping-record flex flex-col', '', styles.base, className)}>
            <div className='flex flex-row justify-between'>
                <InlineEditText className='description flex-grow mb-2 mr-4' autoFocus={true} inputStyles='w-full'
                                onSave={descriptionChanged}>{timeRecord.description}</InlineEditText>
                <div>
                    <Icon icon={clone} className='hover:cursor-pointer mr-2' onClick={cloneRecord} />
                    <Icon icon={trash} className='hover:cursor-pointer' onClick={deleteRecord} />
                </div>
            </div>
            <div className='flex flex-row justify-evenly mb-2'>
                <InlineEditSelect
                    className='client flex-grow mr-4'
                    options={clientSelectOptions}
                    value={timeRecord.client_id.toString()}
                    allowBlank={false}
                    autoFocus={true}
                    selectionChanged={clientChanged}/>

                <InlineEditSelect
                    className='project flex-grow mr-4'
                    options={projectSelectOptions}
                    value={timeRecord.project_id?.toString() || ''}
                    allowBlank={true}
                    autoFocus={true}
                    selectionChanged={projectChanged}/>
            </div>
            <div className='flex flex-row'>
                <InlineEditToggle
                    className='billable mr-4'
                    inputStyles='flex-grow'
                    value={timeRecord.billable}
                    onSave={billableChanged}
                    formatter={(v) => v ? '$' : ' '}
                    autoFocus={true}/>

                <InlineEditDateTime
                    className='start-ts mr-4 z-50'
                    inputStyles='flex-grow'
                    onSave={startDateTimeChanged}
                    autoFocus={true}>{timeRecord.start_ts}</InlineEditDateTime>

                <InlineEditDateTime
                    className='end-ts mr-4 z-50'
                    inputStyles='flex-grow'
                    onSave={endDateTimeChanged}
                    autoFocus={true}>{timeRecord.end_ts}</InlineEditDateTime>

                <p className='hours mr-4'>{timeRecord.hours || 0} {pluralize('hour', timeRecord.hours)}</p>
            </div>
        </div>
    )
};

export default TimekeepingRecord;