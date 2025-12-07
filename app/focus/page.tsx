'use client';

import React from 'react';
import { useGlobalState } from '@/hooks';
import { FocusModule } from '@/components/modules/FocusModule';

export default function FocusPage() {
    const { state, setSessions } = useGlobalState();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <FocusModule sessions={state.focusSessions} setSessions={setSessions} tasks={state.tasks} />
        </div>
    );
}
