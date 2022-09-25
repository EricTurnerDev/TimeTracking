/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Button from '@/components/ui/Button';
import * as db from '@/lib/database';
import {Icon, database} from '@/components/ui/Icon';

const Settings = () => {
    const saveDbButtonClicked = () => {
        db.downloadDatabaseFile().catch(err => console.error(err));
    };

    return (
        <div className='settings'>
            <h1 className='mb-4'>Settings</h1>

            <Button variant='secondary' onClick={saveDbButtonClicked}>
                <Icon icon={database}/> Save a copy of the database
            </Button>
        </div>
    )
};

export default Settings;