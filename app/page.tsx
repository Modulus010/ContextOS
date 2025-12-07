'use client';

import React from 'react';
import { useGlobalState } from '@/hooks';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
    const { state } = useGlobalState();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Dashboard state={state} />
        </div>
    );
}
