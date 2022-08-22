import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import * as db from '../lib/database';
import {AddClientForm, ClientCard} from '../components/clientCard';
import Head from 'next/head';
import Grid from '../components/grid';

export default function Clients() {
    const [clients, setClients] = useState<db.IClientTableProps[]>([]);

    const showClients = async () => {
        const result: db.IClientTableProps[] = await db.getClients();
        setClients(result);
    };

    const clientAdded = () => {
        showClients().catch(e => console.error(e));
    };

    const clientDeleted = () => {
        showClients().catch(e => console.error(e));
    }

    useEffect(() => {
        showClients().catch(e => console.error(e));
    }, [showClients])

    return (
        <div className={classNames('clients')}>
            <Head>
                <title>Clients - TimeTracking</title>
            </Head>

            <AddClientForm className="mb-4" onClientAdded={clientAdded}/>

            <Grid>
                {clients && clients.map((client: db.IClientTableProps) => {
                    return (
                        <ClientCard key={client.id} id={client.id} name={client.client_name}
                                    onClientDeleted={clientDeleted}/>
                    )
                })}
            </Grid>
        </div>
    )
}