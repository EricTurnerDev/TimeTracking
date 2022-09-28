/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Head from 'next/head';
import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';

import * as db from '@/lib/database';
import ActivityHeatMap from '@/components/pages/home/ActivityHeatMap';
import ActivitySummary from '@/components/pages/home/ActivitySummary';

export default function Home() {
    const [activityMapValues, setActivityMapValues] = useState([]);
    const [weekActivitySummary, setWeekActivitySummary] = useState({});
    const [monthActivitySummary, setMonthActivitySummary] = useState({});
    const [yearActivitySummary, setYearActivitySummary] = useState({});

    const fetchActivityMapValues = async () => {
        const vals = await db.getActivityMapValues();
        setActivityMapValues(vals);
    };

    const fetchActivitySummary = async (startTs) => {
        const query = {startTs};
        const [{billable_hours, non_billable_hours, total_hours, num_clients, num_projects}] = await db.getActivitySummaryValues(query);
        return {
            hours: total_hours || 0,
            billableHours: billable_hours || 0,
            nonBillableHours: non_billable_hours || 0,
            numClients: num_clients || 0,
            numProjects: num_projects || 0
        };
    };

    const fetchWeekActivitySummary = async () => {
        const weekStart = DateTime.now().startOf('week').toISO();
        const summary = await fetchActivitySummary(weekStart);
        setWeekActivitySummary(summary);
    };

    const fetchMonthActivitySummary = async () => {
        const monthStart = DateTime.now().startOf('month').toISO();
        const summary = await fetchActivitySummary(monthStart);
        setMonthActivitySummary(summary);
    };

    const fetchYearActivitySummary = async () => {
        const yearStart = DateTime.now().startOf('year').toISO();
        const summary = await fetchActivitySummary(yearStart);
        setYearActivitySummary(summary);
    };

    useEffect(() => {
        fetchActivityMapValues().catch(err => console.error(err));
        fetchWeekActivitySummary().catch(err => console.error(err));
        fetchMonthActivitySummary().catch(err => console.error(err));
        fetchYearActivitySummary().catch(err => console.error(err));
    }, []);

    return (
        <div className="home">
            <Head>
                <title>Home - TimeTracking</title>
            </Head>

            <ActivityHeatMap className='mb-8' values={activityMapValues} />

            <ActivitySummary className='mb-8' title='This week' {...weekActivitySummary} />

            <ActivitySummary className='mb-8' title='This month' {...monthActivitySummary} />

            <ActivitySummary className='mb-8' title='This year' {...yearActivitySummary} />
        </div>
    );
}