import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask } from '../../types';
import { Plus, CheckSquare, Trash, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { generateSubtasks } from '../../services/aiService';
import { formatTime } from '../../utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TaskModuleProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskModule: React.FC<TaskModuleProps> = ({ tasks, setTasks }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: newTaskTitle,
            status: TaskStatus.TODO,
            priority: priority,
            createdAt: Date.now(),
            tags: [],
            subtasks: []
        };

        setTasks(prev => [newTask, ...prev]);
        setNewTaskTitle('');
        setPriority(TaskPriority.MEDIUM);
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            const newStatus = t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
            return {
                ...t,
                status: newStatus,
                completedAt: newStatus === TaskStatus.DONE ? Date.now() : undefined
            };
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const addSubtasks = (taskId: string, newSubtasks: Subtask[]) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            return { ...t, subtasks: [...(t.subtasks || []), ...newSubtasks] };
        }));
    };

    const toggleSubtask = (taskId: string, subtaskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            return {
                ...t,
                subtasks: t.subtasks?.map(st =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                )
            };
        }));
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

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.status === b.status) {
            const pOrder = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
            if (pOrder[a.priority] !== pOrder[b.priority]) {
                return pOrder[b.priority] - pOrder[a.priority];
            }
            return b.createdAt - a.createdAt;
        }
        return a.status === TaskStatus.DONE ? 1 : -1;
    });

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="text-primary" />
                    任务流
                </CardTitle>
                <CardDescription>
                    捕捉任务以减轻认知负担
                </CardDescription>
            </CardHeader>

            <div className="p-4 border-b">
                <form onSubmit={addTask} className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="需要完成什么？"
                            className="w-full"
                        />
                    </div>

                    <Select
                        value={priority}
                        onValueChange={(value) => setPriority(value as TaskPriority)}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="优先级" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TaskPriority.LOW}>低</SelectItem>
                            <SelectItem value={TaskPriority.MEDIUM}>中</SelectItem>
                            <SelectItem value={TaskPriority.HIGH}>高</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button type="submit" size="icon">
                        <Plus className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>暂无任务。清空大脑，保持心流。</p>
                    </div>
                ) : (
                    sortedTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleStatus={() => toggleTaskStatus(task.id)}
                            onDelete={() => deleteTask(task.id)}
                            onAddSubtasks={addSubtasks}
                            onToggleSubtask={(subtaskId) => toggleSubtask(task.id, subtaskId)}
                            priorityColor={priorityColor}
                            getPriorityLabel={getPriorityLabel}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};

interface TaskItemProps {
    task: Task;
    onToggleStatus: () => void;
    onDelete: () => void;
    onAddSubtasks: (taskId: string, newSubtasks: Subtask[]) => void;
    onToggleSubtask: (subtaskId: string) => void;
    priorityColor: (p: TaskPriority) => string;
    getPriorityLabel: (p: TaskPriority) => string;
}

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggleStatus,
    onDelete,
    onAddSubtasks,
    onToggleSubtask,
    priorityColor,
    getPriorityLabel
}) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

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
            onAddSubtasks(task.id, newSubtasks);
            setExpanded(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            className={`transition-all duration-200 overflow-hidden ${task.status === TaskStatus.DONE
                ? 'bg-muted/50 opacity-60'
                : 'hover:shadow-md'
                }`}
        >
            <Collapsible open={expanded} onOpenChange={setExpanded}>
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                            checked={task.status === TaskStatus.DONE}
                            onCheckedChange={() => onToggleStatus()}
                        />

                        <div className="flex flex-col flex-1">
                            <span className={`text-sm font-medium ${task.status === TaskStatus.DONE ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                            </span>
                            <div className="flex gap-2 mt-1 items-center">
                                <Badge variant="outline" className={priorityColor(task.priority)}>
                                    {getPriorityLabel(task.priority)}
                                </Badge>
                                {task.status === TaskStatus.DONE && task.completedAt && (
                                    <span className="text-[10px] text-muted-foreground">
                                        完成于 {formatTime(task.completedAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {task.status !== TaskStatus.DONE && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBreakDown}
                                disabled={loading}
                                className={loading ? 'animate-pulse text-primary' : ''}
                                title="AI 拆解：将任务碎片化"
                            >
                                <Zap className="w-4 h-4" />
                            </Button>
                        )}

                        {task.subtasks && task.subtasks.length > 0 && (
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                            </CollapsibleTrigger>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="hover:text-destructive"
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                    <CollapsibleContent>
                        <div className="bg-muted/30 border-t p-3 pl-10 space-y-2">
                            {task.subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={st.completed}
                                        onCheckedChange={() => onToggleSubtask(st.id)}
                                    />
                                    <span className={`text-xs ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {st.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                )}
            </Collapsible>
        </Card>
    );
};
