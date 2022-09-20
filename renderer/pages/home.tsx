/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Head from 'next/head';
import H1 from '@/components/ui/text/H1';

export default function Home() {
    return (
        <div className="home">
            <Head>
                <title>Home - TimeTracking</title>
            </Head>
            <H1>Home</H1>
        </div>
    );
}
