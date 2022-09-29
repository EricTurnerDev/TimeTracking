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

    const restoreDbButtonClicked = () => {
        db.uploadDatabaseFile().catch(err => console.error(err));
    };

    return (
        <div className='settings'>
            <div className='flex flex-col'>
                <h2 className='mb-4'>Backup and Restore the Database:</h2>

                <Button className='mb-2' variant='secondary' onClick={saveDbButtonClicked}>
                    <Icon icon={database}/> Create a Backup
                </Button>

                <Button variant='secondary' onClick={restoreDbButtonClicked}>
                    <Icon icon={database}/> Restore from a Backup
                </Button>
            </div>
        </div>
    )
};

export default Settings;