import React from 'react';
import Sidebar from './sidebar';

export default function Layout({children}) {
    return (
        <div className='layout flex flex-row'>
            <Sidebar className='min-w-fit min-h-screen' />

            <main className='flex flex-col flex-grow min-h-screen p-4'>
                {children}
            </main>
        </div>
    )
}