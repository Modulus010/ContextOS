'use client';

import React from 'react';
import { JournalEntry } from '@/types';
import { Separator } from "@/components/ui/separator";
import { JournalHeader, JournalEditor, JournalHistory } from './journal';

interface JournalModuleProps {
    entries: JournalEntry[];
}

export const JournalModule: React.FC<JournalModuleProps> = ({ entries }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <JournalHeader />
            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <JournalEditor />
                </div>

                <div className="lg:col-span-1">
                    <JournalHistory entries={entries} />
                </div>
            </div>
        </div>
    );
};
