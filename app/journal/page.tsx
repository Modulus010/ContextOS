'use client';

import React from 'react';
import { useGlobalState } from '@/hooks';
import { JournalModule } from '@/components/modules/JournalModule';

export default function JournalPage() {
    const { state, setJournalEntries } = useGlobalState();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <JournalModule entries={state.journalEntries} setEntries={setJournalEntries} />
        </div>
    );
}
