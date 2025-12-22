/**
 * Business Logic Hooks
 * Custom hooks for complex business logic extracted from components
 */

'use client';

import { useMemo } from 'react';
import { Task, FocusSession, Transaction, JournalEntry, TaskStatus, TaskPriority } from '@/types';

/**
 * Hook for sorting tasks by status and priority
 */
export function useSortedTasks(tasks: Task[]) {
    return useMemo(() => {
        return [...tasks].sort((a, b) => {
            // Status priority: in_progress/todo before done
            if (a.status === TaskStatus.DONE && b.status !== TaskStatus.DONE) return 1;
            if (a.status !== TaskStatus.DONE && b.status === TaskStatus.DONE) return -1;

            // Priority levels
            const priorityOrder = {
                [TaskPriority.HIGH]: 3,
                [TaskPriority.MEDIUM]: 2,
                [TaskPriority.LOW]: 1,
            };

            // Sort by priority within same status
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }

            // Sort by creation time (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [tasks]);
}

/**
 * Hook for filtering and sorting recent activities from all data sources
 */
export function useRecentActivities(
    tasks: Task[],
    focusSessions: FocusSession[],
    transactions: Transaction[],
    journalEntries: JournalEntry[],
    limit: number = 10
) {
    return useMemo(() => {
        type Activity = {
            type: 'task' | 'focus' | 'transaction' | 'journal';
            data: Task | FocusSession | Transaction | JournalEntry;
            time: string;
        };

        const activities: Activity[] = [
            ...tasks
                .filter(t => t.status === TaskStatus.DONE && t.completedAt)
                .map(t => ({ type: 'task' as const, data: t, time: t.completedAt! })),
            ...focusSessions.map(s => ({ type: 'focus' as const, data: s, time: s.startedAt })),
            ...transactions.map(t => ({ type: 'transaction' as const, data: t, time: t.timestamp })),
            ...journalEntries.map(j => ({ type: 'journal' as const, data: j, time: j.timestamp }))
        ];

        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, limit);
    }, [tasks, focusSessions, transactions, journalEntries, limit]);
}

/**
 * Hook for filtering today's data
 */
export function useTodayData<T extends { timestamp?: string; startedAt?: string; completedAt?: string; createdAt?: string }>(
    items: T[]
) {
    return useMemo(() => {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfDayISO = startOfDay.toISOString();

        return items.filter(item => {
            const timestamp = item.timestamp || item.startedAt || item.completedAt || item.createdAt;
            return timestamp && timestamp >= startOfDayISO;
        });
    }, [items]);
}

/**
 * Hook for calculating task statistics
 */
export function useTaskStats(tasks: Task[]) {
    return useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
        const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
        const todo = tasks.filter(t => t.status === TaskStatus.TODO).length;
        const highPriority = tasks.filter(t => t.priority === TaskPriority.HIGH && t.status !== TaskStatus.DONE).length;

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            todo,
            highPriority,
            completionRate,
        };
    }, [tasks]);
}

/**
 * Hook for calculating focus session statistics
 */
export function useFocusStats(sessions: FocusSession[]) {
    return useMemo(() => {
        const totalMinutes = sessions.reduce((sum, s) => sum + Math.floor(s.durationSeconds / 60), 0);
        const completedSessions = sessions.filter(s => s.completed).length;
        const averageMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;

        return {
            totalMinutes,
            completedSessions,
            averageMinutes,
            totalSessions: sessions.length,
        };
    }, [sessions]);
}

/**
 * Hook for calculating transaction statistics
 */
export function useTransactionStats(transactions: Transaction[]) {
    return useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        // Group by category
        const byCategory = transactions.reduce((acc, t) => {
            if (!acc[t.category]) {
                acc[t.category] = { income: 0, expense: 0, count: 0 };
            }
            if (t.type === 'income') {
                acc[t.category].income += t.amount;
            } else {
                acc[t.category].expense += t.amount;
            }
            acc[t.category].count++;
            return acc;
        }, {} as Record<string, { income: number; expense: number; count: number }>);

        return {
            income,
            expenses,
            balance,
            byCategory,
            total: transactions.length,
        };
    }, [transactions]);
}

/**
 * Hook for grouping tasks by deadline urgency
 */
export function useTasksByUrgency(tasks: Task[]) {
    return useMemo(() => {
        const now = new Date();
        const today = new Date(now);
        today.setHours(23, 59, 59, 999);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const overdue: Task[] = [];
        const today_: Task[] = [];
        const tomorrow_: Task[] = [];
        const thisWeek: Task[] = [];
        const later: Task[] = [];
        const noDeadline: Task[] = [];

        tasks.forEach(task => {
            if (task.status === TaskStatus.DONE) return;

            if (!task.deadline) {
                noDeadline.push(task);
                return;
            }

            const deadline = new Date(task.deadline);

            if (deadline < now) {
                overdue.push(task);
            } else if (deadline <= today) {
                today_.push(task);
            } else if (deadline <= tomorrow) {
                tomorrow_.push(task);
            } else if (deadline <= nextWeek) {
                thisWeek.push(task);
            } else {
                later.push(task);
            }
        });

        return {
            overdue,
            today: today_,
            tomorrow: tomorrow_,
            thisWeek,
            later,
            noDeadline,
        };
    }, [tasks]);
}
