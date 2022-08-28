import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import * as db from '../lib/database';
import ClientCard from '../components/clientCard';
import AddClientForm from "../components/addClientForm";
import Head from 'next/head';
import Grid from '../components/grid';

export default function Clients(props) {
    const [clients, setClients] = useState<db.IClientTableProps[]>([]);

    const showClients = async () => {
        const result: db.IClientTableProps[] = await db.getClients();
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

            <h1 className='mb-4'>Clients & Projects</h1>

            <AddClientForm className='mb-4' onClientAdded={clientAdded}/>

            <Grid>
                {clients && clients.map((client: db.IClientTableProps) => {
                    return (
                        <ClientCard key={client.id} client={client} onClientDeleted={clientDeleted}/>
                    )
                })}
            </Grid>
        </div>
    )
}