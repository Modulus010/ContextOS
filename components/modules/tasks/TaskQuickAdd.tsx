import React, { useState } from 'react';
import { TaskStatus, TaskPriority, type TaskPriorityType } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useCreateTask } from '@/hooks';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar24 } from "@/components/date-and-time-picker";

export const TaskQuickAdd: React.FC = () => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriorityType>(TaskPriority.MEDIUM);
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [deadlineTime, setDeadlineTime] = useState<string>('23:59');

    const createTask = useCreateTask();

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        let deadlineISO: string | undefined = undefined;
        if (deadline && deadlineTime) {
            const [hours, minutes] = deadlineTime.split(':');
            const deadlineDate = new Date(deadline);
            deadlineDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            deadlineISO = deadlineDate.toISOString();
        }

        await createTask.mutateAsync({
            title: newTaskTitle,
            status: TaskStatus.TODO,
            priority: priority,
            deadline: deadlineISO,
            tags: [],
            subtasks: []
        });

        setNewTaskTitle('');
        setPriority(TaskPriority.MEDIUM);
        setDeadline(undefined);
        setDeadlineTime('23:59');
    };

    return (
        <form onSubmit={addTask} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="需要完成什么？"
                    className="flex-1 h-11"
                />
                <Button type="submit" size="lg" className="sm:w-auto w-full">
                    <HugeiconsIcon icon={PlusSignIcon} className="mr-2" />
                    添加任务
                </Button>
            </div>

            <div className="flex flex-wrap gap-3">
                <Select
                    value={priority}
                    onValueChange={(value) => setPriority(value as TaskPriorityType)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="优先级" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={TaskPriority.LOW}>🟢 低优先级</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>🟡 中优先级</SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>🔴 高优先级</SelectItem>
                    </SelectContent>
                </Select>

                <Calendar24
                    date={deadline}
                    time={deadlineTime}
                    onDateChange={setDeadline}
                    onTimeChange={setDeadlineTime}
                />
            </div>
        </form>
    );
};
