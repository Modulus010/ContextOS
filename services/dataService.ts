/**
 * Supabase Data Service
 * Service layer for all database operations
 */

import { createClient } from '@/lib/supabase/client';
import { Task, FocusSession, Transaction, JournalEntry } from '@/types';

// Tasks Service
export const tasksService = {
    async getAll(): Promise<Task[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(row => ({
            id: row.id,
            title: row.title,
            status: row.status,
            priority: row.priority,
            createdAt: row.created_at,
            completedAt: row.completed_at,
            tags: row.tags || [],
            subtasks: row.subtasks || [],
        }));
    },

    async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: user.id,
                title: task.title,
                status: task.status,
                priority: task.priority,
                completed_at: task.completedAt,
                tags: task.tags,
                subtasks: task.subtasks || [],
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            status: data.status,
            priority: data.priority,
            createdAt: data.created_at,
            completedAt: data.completed_at,
            tags: data.tags || [],
            subtasks: data.subtasks || [],
        };
    },

    async update(id: string, updates: Partial<Task>): Promise<Task> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.subtasks !== undefined) dbUpdates.subtasks = updates.subtasks;

        const { data, error } = await supabase
            .from('tasks')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            status: data.status,
            priority: data.priority,
            createdAt: data.created_at,
            completedAt: data.completed_at,
            tags: data.tags || [],
            subtasks: data.subtasks || [],
        };
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },
};

// Focus Sessions Service
export const focusSessionsService = {
    async getAll(): Promise<FocusSession[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('focus_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false });

        if (error) throw error;

        return data.map(row => ({
            id: row.id,
            durationSeconds: row.duration_seconds,
            taskId: row.task_id,
            startedAt: row.started_at,
            completed: row.completed,
        }));
    },

    async create(session: Omit<FocusSession, 'id' | 'startedAt'>): Promise<FocusSession> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('focus_sessions')
            .insert({
                user_id: user.id,
                duration_seconds: session.durationSeconds,
                task_id: session.taskId,
                completed: session.completed,
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            durationSeconds: data.duration_seconds,
            taskId: data.task_id,
            startedAt: data.started_at,
            completed: data.completed,
        };
    },

    async update(id: string, updates: Partial<FocusSession>): Promise<FocusSession> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbUpdates: any = {};
        if (updates.durationSeconds !== undefined) dbUpdates.duration_seconds = updates.durationSeconds;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;

        const { data, error } = await supabase
            .from('focus_sessions')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            durationSeconds: data.duration_seconds,
            taskId: data.task_id,
            startedAt: data.started_at,
            completed: data.completed,
        };
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('focus_sessions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },
};

// Transactions Service
export const transactionsService = {
    async getAll(): Promise<Transaction[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        return data.map(row => ({
            id: row.id,
            amount: parseFloat(row.amount),
            description: row.description,
            type: row.type,
            category: row.category,
            timestamp: row.timestamp,
        }));
    },

    async create(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                amount: transaction.amount,
                description: transaction.description,
                type: transaction.type,
                category: transaction.category,
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            amount: parseFloat(data.amount),
            description: data.description,
            type: data.type,
            category: data.category,
            timestamp: data.timestamp,
        };
    },

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbUpdates: any = {};
        if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.type !== undefined) dbUpdates.type = updates.type;
        if (updates.category !== undefined) dbUpdates.category = updates.category;

        const { data, error } = await supabase
            .from('transactions')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            amount: parseFloat(data.amount),
            description: data.description,
            type: data.type,
            category: data.category,
            timestamp: data.timestamp,
        };
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },
};

// Journal Entries Service
export const journalEntriesService = {
    async getAll(): Promise<JournalEntry[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        return data.map(row => ({
            id: row.id,
            content: row.content,
            mood: row.mood,
            timestamp: row.timestamp,
            aiReflection: row.ai_reflection,
        }));
    },

    async create(entry: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('journal_entries')
            .insert({
                user_id: user.id,
                content: entry.content,
                mood: entry.mood,
                ai_reflection: entry.aiReflection,
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            content: data.content,
            mood: data.mood,
            timestamp: data.timestamp,
            aiReflection: data.ai_reflection,
        };
    },

    async update(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbUpdates: any = {};
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.mood !== undefined) dbUpdates.mood = updates.mood;
        if (updates.aiReflection !== undefined) dbUpdates.ai_reflection = updates.aiReflection;

        const { data, error } = await supabase
            .from('journal_entries')
            .update(dbUpdates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            content: data.content,
            mood: data.mood,
            timestamp: data.timestamp,
            aiReflection: data.ai_reflection,
        };
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },
};
