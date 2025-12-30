'use client';

import React from 'react';
import { Task } from '@/types';
import { useSortedTasks } from '@/hooks';
import { Separator } from "@/components/ui/separator";
import { TaskHeader, TaskQuickAdd, TaskList } from './tasks';

interface TaskModuleProps {
    tasks: Task[];
}

export const TaskModule: React.FC<TaskModuleProps> = ({ tasks }) => {
    const sortedTasks = useSortedTasks(tasks);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <TaskHeader />
            <Separator />
            <TaskQuickAdd />
            <Separator />
            <div className="space-y-3">
                <TaskList tasks={sortedTasks} />
            </div>
        </div>
    );
};
