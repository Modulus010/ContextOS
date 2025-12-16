'use client';

import React from 'react';
import { useTasks } from '@/hooks/useSupabaseData';
import { TaskModule } from '@/components/modules/TaskModule';

export default function TasksPage() {
    const { data: tasks = [], isLoading } = useTasks();

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载中...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <TaskModule tasks={tasks} />
        </div>
    );
}
