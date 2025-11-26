import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask } from '../../types';
import { IconPlus, IconCheckSquare, IconTrash, IconFlag, IconZap, IconChevronDown, IconChevronUp } from '../Icons';
import { generateSubtasks } from '../../services/aiService';

interface TaskModuleProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskModule: React.FC<TaskModuleProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());

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
      return {
        ...t,
        status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE
      };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const breakDownTask = async (task: Task) => {
    if (loadingTasks.has(task.id)) return;

    setLoadingTasks(prev => new Set(prev).add(task.id));
    const steps = await generateSubtasks(task.title);

    setTasks(prev => prev.map(t => {
      if (t.id !== task.id) return t;
      const newSubtasks: Subtask[] = steps.map(step => ({
        id: crypto.randomUUID(),
        title: step,
        completed: false
      }));
      return { ...t, subtasks: [...(t.subtasks || []), ...newSubtasks] };
    }));

    setExpandedTasks(prev => new Set(prev).add(task.id));
    setLoadingTasks(prev => {
      const next = new Set(prev);
      next.delete(task.id);
      return next;
    });
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

  const toggleExpand = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) {
      // Primary sort: Priority
      const pOrder = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
      if (pOrder[a.priority] !== pOrder[b.priority]) {
        return pOrder[b.priority] - pOrder[a.priority];
      }
      // Secondary sort: Creation Time
      return b.createdAt - a.createdAt;
    }
    return a.status === TaskStatus.DONE ? 1 : -1;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <IconCheckSquare className="text-indigo-600 dark:text-indigo-400" />
          任务流
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">捕捉任务以减轻认知负担。</p>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <form onSubmit={addTask} className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="需要完成什么？"
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={TaskPriority.LOW}>低</option>
            <option value={TaskPriority.MEDIUM}>中</option>
            <option value={TaskPriority.HIGH}>高</option>
          </select>

          <button
            type="submit"
            className="p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <IconPlus className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p>暂无任务。清空大脑，保持心流。</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <div
              key={task.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${task.status === TaskStatus.DONE
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
                }`}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${task.status === TaskStatus.DONE
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                  >
                    {task.status === TaskStatus.DONE && <IconCheckSquare className="w-3 h-3" />}
                  </button>

                  <div className="flex flex-col flex-1">
                    <span className={`text-sm font-medium ${task.status === TaskStatus.DONE ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.title}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${priorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {task.status !== TaskStatus.DONE && (
                    <button
                      onClick={() => breakDownTask(task)}
                      disabled={loadingTasks.has(task.id)}
                      className={`p-2 rounded-lg text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${loadingTasks.has(task.id) ? 'animate-pulse text-indigo-400' : ''}`}
                      title="AI 拆解：将任务碎片化"
                    >
                      <IconZap className="w-4 h-4" />
                    </button>
                  )}

                  {task.subtasks && task.subtasks.length > 0 && (
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {expandedTasks.has(task.id) ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              {expandedTasks.has(task.id) && task.subtasks && task.subtasks.length > 0 && (
                <div className="bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 p-3 pl-10 space-y-2">
                  {task.subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSubtask(task.id, st.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${st.completed ? 'bg-indigo-400 border-indigo-400' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                      >
                        {st.completed && <IconCheckSquare className="w-2.5 h-2.5 text-white" />}
                      </button>
                      <span className={`text-xs ${st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};