'use client';

import React, { useState } from 'react';
import { JournalEntry } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { JournalHeader, JournalEditor, JournalHistory } from './journal';

interface JournalModuleProps {
    entries: JournalEntry[];
}

export const JournalModule: React.FC<JournalModuleProps> = ({ entries }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <JournalHeader />

            <div className="relative">
                <JournalHistory entries={entries} />

                {/* Floating Action Button */}
                <Button
                    onClick={() => setIsDrawerOpen(true)}
                    size="lg"
                    className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-40"
                >
                    <HugeiconsIcon icon={PencilEdit02Icon} className="w-6 h-6" />
                    <span className="sr-only">写日记</span>
                </Button>
            </div>

            {/* Editor Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent className="max-w-2xl mx-auto">
                    <DrawerHeader>
                        <DrawerTitle>记录今天的想法</DrawerTitle>
                        <DrawerDescription>
                            写下你的感受，让 AI 帮你分析和反思
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <JournalEditor onEntryCreated={() => setIsDrawerOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
