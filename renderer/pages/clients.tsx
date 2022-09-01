import classNames from 'classnames';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';

import * as db from '../lib/database';
import AddClientForm from "../components/AddClientForm";
import ClientCard from '../components/ClientCard';
import Grid from '../components/Grid';

export default function Clients(props) {
    const [clients, setClients] = useState<Database.IClientsTable[]>([]);

    const showClients = async () => {
        const result: Database.IClientsTable[] = await db.getClients();
        setClients(result);
    };

    const clientAdded = () => {
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

            <AddClientForm className='mb-4' onClientAdded={clientAdded}/>

            <Grid>
                {clients && clients.map((client: Database.IClientsTable) => {
                    return (
                        <ClientCard key={client.id} client={client} onClientDeleted={clientDeleted}/>
                    )
                })}
            </Grid>
        </div>
    )
}