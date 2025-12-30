import React from 'react';
import { Task } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { TaskItem } from './TaskItem';

interface TaskListProps {
    tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <HugeiconsIcon icon={Task01Icon} className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">暂无任务</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    看起来你现在很清闲！添加一个新任务来开始高效的一天吧。
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};
