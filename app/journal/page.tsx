import React from 'react';
import { Metadata } from 'next';
import { getJournalEntries } from '@/services/serverDataService';
import { JournalModule } from '@/components/modules/JournalModule';

export const metadata: Metadata = {
    title: '日记 - Nexus',
    description: '记录您的想法和心情',
};

export default async function JournalPage() {
    const entries = await getJournalEntries();

    return (
        <JournalModule entries={entries} />
    );
}
