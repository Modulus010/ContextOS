'use client';

import React from 'react';
import { useJournalEntries } from '@/hooks/useSupabaseData';
import { JournalModule } from '@/components/modules/JournalModule';

export default function JournalPage() {
    const { data: entries = [], isLoading } = useJournalEntries();

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载中...</p>
            </div>
        );
    }

    return (
        <JournalModule entries={entries} />
    );
}
