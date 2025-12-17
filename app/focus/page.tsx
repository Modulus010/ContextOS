'use client';

import React from 'react';
import { useFocusSessions, useTasks } from '@/hooks/useSupabaseData';
import { FocusModule } from '@/components/modules/FocusModule';

export default function FocusPage() {
    const { data: sessions = [], isLoading: sessionsLoading } = useFocusSessions();
    const { data: tasks = [], isLoading: tasksLoading } = useTasks();

    if (sessionsLoading || tasksLoading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载中...</p>
            </div>
        );
    }

    return (
        <FocusModule sessions={sessions} tasks={tasks} />
    );
}
