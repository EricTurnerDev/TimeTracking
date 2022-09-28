/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import {DateTime} from 'luxon';
import CalendarHeatmap from 'react-calendar-heatmap';

import 'react-calendar-heatmap/dist/styles.css';

export interface IActivityHeatMapValue {
    date: string;
    count: number;
}

interface IActivityHeatMapProps {
    values: IActivityHeatMapValue[];
    className?: string;
}

const ActivityHeatMap = ({values, className}: IActivityHeatMapProps) => {
    const now = DateTime.now();
    const lastYear = now.minus({years: 1});

    return (
        <div className={classNames('activity-heat-map', className)}>
            <CalendarHeatmap
                startDate={lastYear.toJSDate()}
                endDate={now.toJSDate()}
                values={values}
            />
        </div>
    )
};

export default ActivityHeatMap;