import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask } from '../../types';
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Task01Icon, Delete02Icon, FlashIcon, ArrowDown01Icon, ArrowUp01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { generateSubtasks } from '../../services/aiService';
import { formatTime } from '../../utils/dateTime';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useSupabaseData';
import { InlineEditor } from '@/components/common/InlineEditor';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Calendar24 } from "@/components/date-and-time-picker";

interface TaskModuleProps {
    tasks: Task[];
}

export const TaskModule: React.FC<TaskModuleProps> = ({ tasks }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
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

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status === b.status) {
            const pOrder = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
            if (pOrder[a.priority] !== pOrder[b.priority]) {
                return pOrder[b.priority] - pOrder[a.priority];
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.status === TaskStatus.DONE ? 1 : -1;
    });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <HugeiconsIcon icon={Task01Icon} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">任务流</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            捕捉任务以减轻认知负担
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Quick Add Form */}
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
                        onValueChange={(value) => setPriority(value as TaskPriority)}
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

            <Separator />

            {/* Tasks List */}
            <div className="space-y-3">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                            <HugeiconsIcon icon={Task01Icon} className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">暂无任务</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            看起来你现在很清闲！添加一个新任务来开始高效的一天吧。
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sortedTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const toggleTaskStatus = async () => {
        const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        await updateTask.mutateAsync({
            id: task.id,
            updates: { status: newStatus }
        });
    };

    const handleDelete = async () => {
        await deleteTask.mutateAsync(task.id);
    };

    const addSubtasks = async (newSubtasks: Subtask[]) => {
        await updateTask.mutateAsync({
            id: task.id,
            updates: {
                subtasks: [...(task.subtasks || []), ...newSubtasks]
            }
        });
    };

    const toggleSubtask = async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        await updateTask.mutateAsync({
            id: task.id,
            updates: { subtasks: updatedSubtasks }
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
            updates: {
                subtasks: [...(task.subtasks || []), newSubtask]
            }
        });
    };

    const updateSubtask = async (subtaskId: string, newTitle: string) => {
        const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, title: newTitle } : st
        );
        await updateTask.mutateAsync({
            id: task.id,
            updates: { subtasks: updatedSubtasks }
        });
    };

    const updateTaskTitle = async (newTitle: string) => {
        await updateTask.mutateAsync({
            id: task.id,
            updates: { title: newTitle }
        });
    };

    const deleteSubtask = async (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtaskId);
        await updateTask.mutateAsync({
            id: task.id,
            updates: { subtasks: updatedSubtasks }
        });
    };

    const priorityColor = (p: TaskPriority) => {
        switch (p) {
            case TaskPriority.HIGH: return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50';
            case TaskPriority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50';
            case TaskPriority.LOW: return 'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
            default: return 'text-slate-600';
        }
    };

    const getPriorityLabel = (p: TaskPriority) => {
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
                                    displayClassName={`text-base font-medium leading-relaxed ${task.status === TaskStatus.DONE
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
                                            完成于 {formatTime(task.completedAt)}
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
                    <div className="px-4 pb-4 pt-3 space-y-2">
                        {task.subtasks?.map(st => (
                            <div
                                key={st.id}
                                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                            >
                                <Checkbox
                                    checked={st.completed}
                                    onCheckedChange={() => toggleSubtask(st.id)}
                                />
                                <div className="flex-1">
                                    <InlineEditor
                                        value={st.title}
                                        onSave={(newTitle) => updateSubtask(st.id, newTitle)}
                                        onDelete={() => deleteSubtask(st.id)}
                                        placeholder="输入子任务..."
                                        displayClassName={`text-sm ${st.completed
                                            ? 'line-through text-muted-foreground'
                                            : 'text-foreground'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Add Subtask */}
                        <div className="py-2 px-3">
                            <InlineEditor
                                value=""
                                onSave={addSubtask}
                                placeholder="输入子任务..."
                            />
                        </div>

                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};
