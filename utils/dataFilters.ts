/**
 * Data Filter and Calculation Utility Functions
 */

import { Task, FocusSession, Transaction, JournalEntry, TaskStatus, TransactionType } from '../types';
import { getStartOfDay } from './dateTime';

/**
 * Get tasks completed today
 */
export const getCompletedTasksToday = (tasks: Task[], date?: Date): Task[] => {
    const startOfDay = new Date(getStartOfDay(date));
    return tasks.filter(t =>
        t.status === TaskStatus.DONE &&
        t.completedAt &&
        new Date(t.completedAt) >= startOfDay
    );
};

/**
 * Get pending tasks (not completed)
 */
export const getPendingTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(t => t.status !== TaskStatus.DONE);
};

/**
 * Get focus minutes today
 */
export const getFocusMinutesToday = (sessions: FocusSession[], date?: Date): number => {
    const startOfDay = new Date(getStartOfDay(date));
    const totalSeconds = sessions
        .filter(s => new Date(s.startedAt) >= startOfDay)
        .reduce((acc, session) => acc + session.durationSeconds, 0);
    return Math.floor(totalSeconds / 60);
};

/**
 * Get total expenses today
 */
export const getExpensesToday = (transactions: Transaction[], date?: Date): number => {
    const startOfDay = new Date(getStartOfDay(date));
    return transactions
        .filter(t => t.type === TransactionType.EXPENSE && new Date(t.timestamp) >= startOfDay)
        .reduce((acc, t) => acc + t.amount, 0);
};

/**
 * Get today's transactions
 */
export const getTransactionsToday = (transactions: Transaction[], date?: Date): Transaction[] => {
    const startOfDay = new Date(getStartOfDay(date));
    return transactions.filter(t => new Date(t.timestamp) >= startOfDay);
};

/**
 * Get latest mood from journal entries
 */
export const getLatestMood = (entries: JournalEntry[]): string => {
    return entries.length > 0 ? entries[0].mood : 'unknown';
};

/**
 * Get latest journal entry content (truncated)
 */
export const getLatestJournalEntry = (entries: JournalEntry[], length: number = 100): string => {
    return entries.length > 0 ? entries[0].content.substring(0, length) : 'none';
};
