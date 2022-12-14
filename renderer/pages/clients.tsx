/*
 * Copyright (c) 2022, Eric Turner.
 *
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import classNames from 'classnames';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {DatabaseInterfaces} from 'timetracking-common';

import * as db from '@/lib/database';
import AddClientForm from '@/components/pages/clients/AddClientForm';
import ClientCard from '@/components/pages/clients/ClientCard';
import Button from '@/components/ui/Button';
import {Icon, plus} from '@/components/ui/Icon';

export default function Clients(props) {
    const [clients, setClients] = useState<DatabaseInterfaces.IClient[]>([]);
    const [addingClient, setAddingClient] = useState<boolean>(false);

    const showClients = async () => {
        const result: DatabaseInterfaces.IClient[] = await db.getClients();
        setClients(result);
    };

    const addClientButtonClicked = () => {
        setAddingClient(true);
    }

    const addingClientCanceled = () => {
        setAddingClient(false);
    }

    const clientAdded = () => {
        setAddingClient(false);
        showClients().catch(err => console.error(err));
    };

    const clientDeleted = () => {
        showClients().catch(err => console.error(err));
    }

    useEffect(() => {
        showClients().catch(err => console.error(err));
    }, [])

    return (
        <div className={classNames('clients')}>
            <Head>
                <title>Clients - TimeTracking</title>
            </Head>

            <div className='text-right mb-4'>
                <Button onClick={addClientButtonClicked} disabled={addingClient}>
                    <Icon icon={plus} /> New Client
                </Button>
            </div>

            {addingClient && <AddClientForm className='mb-4' onClientAdded={clientAdded} onCancel={addingClientCanceled}/>}

                {clients && clients.map((client: DatabaseInterfaces.IClient) => {
                    return (
                        <ClientCard key={client.id} className='mb-8' client={client} onClientDeleted={clientDeleted} />
                    )
                })}
        </div>
    )
}