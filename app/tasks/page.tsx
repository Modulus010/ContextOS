'use client';

import React from 'react';
import { useGlobalState } from '@/hooks';
import { TaskModule } from '@/components/modules/TaskModule';

export default function TasksPage() {
    const { state, setTasks } = useGlobalState();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <TaskModule tasks={state.tasks} setTasks={setTasks} />
        </div>
    );
}
