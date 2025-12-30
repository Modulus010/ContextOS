import React from 'react';
import { Metadata } from 'next';
import { getTasks } from '@/services/serverDataService';
import { TaskModule } from '@/components/modules/TaskModule';

export const metadata: Metadata = {
    title: '任务管理 - Nexus',
    description: '管理您的任务和待办事项',
};

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <TaskModule tasks={tasks} />
    );
}
