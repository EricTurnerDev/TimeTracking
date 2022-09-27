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
import H1 from '@/components/ui/text/H1';
import ActivityHeatMap from '@/components/pages/home/ActivityHeatMap';

export default function Home() {
    const lastYear = DateTime.now().minus({years: 1});
    const [values, setValues] = useState([]);

    useEffect(() => {
        db.getActivityMapValues()
            .then(values => {
                setValues(values)
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home">
            <Head>
                <title>Home - TimeTracking</title>
            </Head>

            <ActivityHeatMap values={values} />
        </div>
    );
}