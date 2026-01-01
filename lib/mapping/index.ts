/**
 * Data Mapping Utilities
 * Automatic snake_case ↔ camelCase conversion for database mapping
 */

import { Task, FocusSession, Transaction, JournalEntry, Subtask } from '@/lib/validation/schemas';

// Type-safe mappers for specific entities
export const TaskMapper = {
    fromDb(row: any): Task {
        return {
            id: row.id,
            title: row.title,
            status: row.status,
            priority: row.priority,
            createdAt: row.created_at,
            completedAt: row.completed_at || undefined,
            deadline: row.deadline || undefined,
            tags: row.tags || [],
            subtasks: (row.subtasks || []).map((st: any) => ({
                id: st.id,
                title: st.title,
                completed: st.completed ?? false,
            })),
        };
    },

    toDb(task: Partial<Task>): any {
        const result: any = {};
        if (task.title !== undefined) result.title = task.title;
        if (task.status !== undefined) result.status = task.status;
        if (task.priority !== undefined) result.priority = task.priority;
        if (task.completedAt !== undefined) result.completed_at = task.completedAt;
        if (task.deadline !== undefined) result.deadline = task.deadline;
        if (task.tags !== undefined) result.tags = task.tags;
        if (task.subtasks !== undefined) result.subtasks = task.subtasks;
        return result;
    },

    toDbInsert(task: Omit<Task, 'id' | 'createdAt'>): any {
        return {
            title: task.title,
            status: task.status,
            priority: task.priority,
            completed_at: task.completedAt,
            deadline: task.deadline,
            tags: task.tags,
            subtasks: task.subtasks || [],
        };
    },
};

export const FocusSessionMapper = {
    fromDb(row: any): FocusSession {
        return {
            id: row.id,
            durationSeconds: row.duration_seconds,
            taskId: row.task_id || undefined,
            startedAt: row.started_at,
            completed: row.completed,
        };
    },

    toDb(session: Partial<FocusSession>): any {
        const result: any = {};
        if (session.durationSeconds !== undefined) result.duration_seconds = session.durationSeconds;
        if (session.taskId !== undefined) result.task_id = session.taskId;
        if (session.startedAt !== undefined) result.started_at = session.startedAt;
        if (session.completed !== undefined) result.completed = session.completed;
        return result;
    },

    toDbInsert(session: Omit<FocusSession, 'id' | 'startedAt'>): any {
        return {
            duration_seconds: session.durationSeconds,
            task_id: session.taskId,
            completed: session.completed,
        };
    },
};

export const TransactionMapper = {
    fromDb(row: any): Transaction {
        return {
            id: row.id,
            amount: row.amount,
            description: row.description,
            type: row.type,
            category: row.category,
            timestamp: row.timestamp,
        };
    },

    toDb(transaction: Partial<Transaction>): any {
        const result: any = {};
        if (transaction.amount !== undefined) result.amount = transaction.amount;
        if (transaction.description !== undefined) result.description = transaction.description;
        if (transaction.type !== undefined) result.type = transaction.type;
        if (transaction.category !== undefined) result.category = transaction.category;
        if (transaction.timestamp !== undefined) result.timestamp = transaction.timestamp;
        return result;
    },

    toDbInsert(transaction: Omit<Transaction, 'id' | 'timestamp'>): any {
        return {
            amount: transaction.amount,
            description: transaction.description,
            type: transaction.type,
            category: transaction.category,
        };
    },
};

export const JournalEntryMapper = {
    fromDb(row: any): JournalEntry {
        return {
            id: row.id,
            content: row.content,
            mood: row.mood,
            timestamp: row.timestamp,
            aiReflection: row.ai_reflection || undefined,
        };
    },

    toDb(entry: Partial<JournalEntry>): any {
        const result: any = {};
        if (entry.content !== undefined) result.content = entry.content;
        if (entry.mood !== undefined) result.mood = entry.mood;
        if (entry.timestamp !== undefined) result.timestamp = entry.timestamp;
        if (entry.aiReflection !== undefined) result.ai_reflection = entry.aiReflection;
        return result;
    },

    toDbInsert(entry: Omit<JournalEntry, 'id' | 'timestamp'>): any {
        return {
            content: entry.content,
            mood: entry.mood,
            ai_reflection: entry.aiReflection,
        };
    },
};
