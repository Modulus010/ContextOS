import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, type TaskPriorityType, type Subtask } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, FlashIcon, ArrowDown01Icon, ArrowUp01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { generateSubtasks } from '@/services/aiService';
import { format } from 'date-fns';
import { useUpdateTask, useDeleteTask } from '@/hooks';
import { InlineEditor } from '@/components/common/InlineEditor';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SubtaskList } from './SubtaskList';

interface TaskItemProps {
    task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const toggleTaskStatus = async () => {
        const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        await updateTask.mutateAsync({
            id: task.id,
            status: newStatus
        });
    };

    const handleDelete = async () => {
        await deleteTask.mutateAsync(task.id);
    };

    const addSubtasks = async (newSubtasks: Subtask[]) => {
        await updateTask.mutateAsync({
            id: task.id,
            subtasks: [...(task.subtasks || []), ...newSubtasks]
        });
    };

    const toggleSubtask = async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        await updateTask.mutateAsync({
            id: task.id,
            subtasks: updatedSubtasks
        });
    };

    const addSubtask = async (title: string) => {
        if (!title.trim()) {
            return;
        }

        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            title: title.trim(),
            completed: false
        };

        await updateTask.mutateAsync({
            id: task.id,
            subtasks: [...(task.subtasks || []), newSubtask]
        });
    };

    const updateSubtask = async (subtaskId: string, newTitle: string) => {
        const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, title: newTitle } : st
        );
        await updateTask.mutateAsync({
            id: task.id,
            subtasks: updatedSubtasks
        });
    };

    const updateTaskTitle = async (newTitle: string) => {
        await updateTask.mutateAsync({
            id: task.id,
            title: newTitle
        });
    };

    const deleteSubtask = async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtaskId);
        await updateTask.mutateAsync({
            id: task.id,
            subtasks: updatedSubtasks
        });
    };

    const priorityColor = (p: TaskPriorityType) => {
        switch (p) {
            case TaskPriority.HIGH: return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50';
            case TaskPriority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50';
            case TaskPriority.LOW: return 'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
            default: return 'text-slate-600';
        }
    };

    const getPriorityLabel = (p: TaskPriorityType) => {
        switch (p) {
            case TaskPriority.HIGH: return '高';
            case TaskPriority.MEDIUM: return '中';
            case TaskPriority.LOW: return '低';
            default: return '';
        }
    };

    const handleBreakDown = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const steps = await generateSubtasks(task.title);
            const newSubtasks: Subtask[] = steps.map(step => ({
                id: crypto.randomUUID(),
                title: step,
                completed: false
            }));
            await addSubtasks(newSubtasks);
            setExpanded(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="transition-all hover:shadow-md">
            <Collapsible open={expanded} onOpenChange={setExpanded}>
                <div className="p-4">
                    <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                            <Checkbox
                                checked={task.status === TaskStatus.DONE}
                                onCheckedChange={toggleTaskStatus}
                                className="h-5 w-5"
                            />
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="space-y-1">
                                <InlineEditor
                                    value={task.title}
                                    onSave={updateTaskTitle}
                                    onDelete={handleDelete}
                                    placeholder="输入任务标题..."
                                    displayClassName={`text-base font-medium leading-relaxed ${
                                        task.status === TaskStatus.DONE
                                            ? 'line-through text-muted-foreground'
                                            : 'text-foreground'
                                    }`}
                                    inputClassName="h-9 text-base"
                                />

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`${priorityColor(task.priority)} text-xs`}
                                    >
                                        {getPriorityLabel(task.priority)}
                                    </Badge>

                                    {task.deadline && task.status !== TaskStatus.DONE && (
                                        <Badge variant="outline" className="text-xs gap-1">
                                            <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                                            {new Date(task.deadline).toLocaleString('zh-CN', {
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Badge>
                                    )}

                                    {task.status === TaskStatus.DONE && task.completedAt && (
                                        <span className="text-xs text-muted-foreground">
                                            完成于 {format(new Date(task.completedAt), new Date(task.completedAt).getFullYear() !== new Date().getFullYear() ? 'yyyy/M/d HH:mm' : 'M/d HH:mm')}
                                        </span>
                                    )}

                                    {task.subtasks && task.subtasks.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} 子任务
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                            {task.status !== TaskStatus.DONE && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBreakDown}
                                    disabled={loading}
                                    title="AI 拆解：将任务碎片化"
                                    className="h-9 w-9"
                                >
                                    <HugeiconsIcon icon={FlashIcon} className={loading ? 'animate-pulse' : ''} />
                                </Button>
                            )}

                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                >
                                    <HugeiconsIcon
                                        icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
                                    />
                                </Button>
                            </CollapsibleTrigger>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <HugeiconsIcon icon={Delete02Icon} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Subtasks */}
                <CollapsibleContent>
                    <Separator />
                    <SubtaskList
                        subtasks={task.subtasks || []}
                        onToggle={toggleSubtask}
                        onUpdate={updateSubtask}
                        onDelete={deleteSubtask}
                        onAdd={addSubtask}
                    />
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};
