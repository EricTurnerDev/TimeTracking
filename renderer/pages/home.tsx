import React from 'react';
import Head from 'next/head';
import * as db from "../lib/database";
import {useState} from "react";
import {ClientProps} from "../lib/database";

export default function Home() {
    const [clients, setClients] = useState<ClientProps[]>([]);

    const showClients = async () => {
        const result: ClientProps[] = await db.getClients();
        setClients(result);
    };

    return (
        <>
            <Head>
                <title>Home - TimeTracking</title>
            </Head>

            <button className="block" onClick={showClients}>Show Clients</button>

            {clients && clients.map((client: ClientProps) => {
                return (
                    <p key={client.id}>{client.client_name}</p>
                )
            })}
        </>
    );
}
