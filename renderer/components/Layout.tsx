/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({children}) {
    return (
        <div className='layout flex flex-row'>
            <Sidebar className='fixed top-0 left-0 right-auto w-[15rem] min-h-screen' />

            <main className='flex flex-col flex-grow min-h-screen pl-[16rem] p-4'>
                {children}
            </main>
        </div>
    )
}