import React from 'react';
import { Metadata } from 'next';
import { getFocusSessions, getTasks } from '@/services/serverDataService';
import { FocusModule } from '@/components/modules/FocusModule';

export const metadata: Metadata = {
    title: '专注计时 - Nexus',
    description: '跟踪您的专注时间和效率',
};

export default async function FocusPage() {
    const [sessions, tasks] = await Promise.all([
        getFocusSessions(),
        getTasks()
    ]);

    return (
        <FocusModule sessions={sessions} tasks={tasks} />
    );
}
