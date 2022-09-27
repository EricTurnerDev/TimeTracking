/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CalendarHeatmap from 'react-calendar-heatmap';
import {DateTime} from 'luxon';

import 'react-calendar-heatmap/dist/styles.css';

export interface IActivityHeatMapValue {
    date: string,
    count: number
}

interface IActivityHeatMapProps {
    values: IActivityHeatMapValue[]
}


const ActivityHeatMap = ({values}: IActivityHeatMapProps) => {
    const totalHours = values.reduce((accum, value) => accum + value.count, 0);

    const now = DateTime.now();
    const lastYear = now.minus({years: 1});


    return (
        <div className='activity-heat-map'>
            <p className='mb-2'>{totalHours.toFixed(2)} hours in the last year</p>
            <CalendarHeatmap
                startDate={lastYear.toJSDate()}
                endDate={now.toJSDate()}
                values={values}
            />
        </div>
    )
};

export default ActivityHeatMap;