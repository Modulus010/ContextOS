import React from 'react';
import { Metadata } from 'next';
import { Dashboard } from '@/components/Dashboard';
import { getAllData } from '@/services/serverDataService';

export const metadata: Metadata = {
    title: '概览 - Nexus',
    description: '您的个人上下文操作系统',
};

export default async function HomePage() {
    const { tasks, focusSessions, transactions, journalEntries } = await getAllData();

    return (
        <div className="p-4 md:p-6 mx-auto w-full">
            <Dashboard
                tasks={tasks}
                focusSessions={focusSessions}
                transactions={transactions}
                journalEntries={journalEntries}
            />
        </div>
    );
}
