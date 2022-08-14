import React from 'react';
import Head from 'next/head';
import {notify} from "../lib/notification";
import {send} from "../lib/db";
import {useState} from "react";
import {ClientProps} from "../lib/db";

function Home() {
    const [clients, setClients] = useState<ClientProps[]>([]);

    const onShowClientsClicked = async () => {
        const result: ClientProps[] = await send('SELECT * FROM clients');
        await setClients(result);
        notify('', 'Database query complete');
    };

    return (
        <>
            <Head>
                <title>Home - Timetracking</title>
            </Head>

            <button className="block" onClick={onShowClientsClicked}>Show Clients</button>

            {clients && clients.map((client: ClientProps) => {
                return (
                    <p key={client.id}>{client.client_name}</p>
                )
            })}
        </>
    );
}

export default Home;
