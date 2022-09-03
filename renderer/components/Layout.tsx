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