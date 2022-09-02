import classNames from 'classnames';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {Database} from 'timetracking-common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

import * as db from '../lib/database';
import AddClientForm from "../components/AddClientForm";
import ClientCard from '../components/ClientCard';
import Button from '../components/ui/Button';
import Grid from '../components/ui/Grid';

export default function Clients(props) {
    const [clients, setClients] = useState<Database.IClient[]>([]);
    const [addingClient, setAddingClient] = useState<boolean>(false);

    const showClients = async () => {
        const result: Database.IClient[] = await db.getClients();
        setClients(result);
    };

    const addClientButtonClicked = () => {
        setAddingClient(true);
    }

    const clientAdded = () => {
        setAddingClient(false);
        showClients().catch(err => console.error(err));
    };

    const addingClientCanceled = () => {
        setAddingClient(false);
    }

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
                    <FontAwesomeIcon icon={faPlus} /> New Client
                </Button>
            </div>

            {addingClient && <AddClientForm className='mb-4' onClientAdded={clientAdded} onCancel={addingClientCanceled}/>}

            <Grid>
                {clients && clients.map((client: Database.IClient) => {
                    return (
                        <ClientCard key={client.id} client={client} onClientDeleted={clientDeleted} />
                    )
                })}
            </Grid>
        </div>
    )
}