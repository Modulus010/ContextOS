import React from 'react';
import { Task } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface TaskSelectionProps {
    selectedTaskId: string;
    onTaskSelect: (taskId: string) => void;
    tasks: Task[];
    disabled: boolean;
}

export const TaskSelection: React.FC<TaskSelectionProps> = ({
    selectedTaskId,
    onTaskSelect,
    tasks,
    disabled
}) => {
    return (
        <div className="mb-8">
            <label className="block text-sm font-medium mb-3">
                当前意图
            </label>
            <Select
                value={selectedTaskId}
                onValueChange={(val) => onTaskSelect(val || '')}
                disabled={disabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择一个任务或无特定任务" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='None'>🎯 无特定任务</SelectItem>
                    {tasks.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                            {t.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
