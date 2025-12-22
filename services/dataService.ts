/**
 * Supabase Data Service
 * Service layer for all database operations with improved mapping and error handling
 */

import { createClient } from '@/lib/supabase/client';
import {
    Task,
    FocusSession,
    Transaction,
    JournalEntry,
    CreateTaskInput,
    UpdateTaskInput,
    CreateFocusSessionInput,
    UpdateFocusSessionInput,
    CreateTransactionInput,
    UpdateTransactionInput,
    CreateJournalEntryInput,
    UpdateJournalEntryInput,
} from '@/types';
import {
    TaskMapper,
    FocusSessionMapper,
    TransactionMapper,
    JournalEntryMapper
} from '@/lib/mapping';
import { ErrorHandler, safeAsync } from '@/lib/errors';

// Tasks Service
export const tasksService = {
    async getAll(): Promise<Task[]> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw ErrorHandler.database('获取任务列表失败', error);

            return data.map(row => TaskMapper.fromDb(row));
        });
    },

    async create(task: CreateTaskInput): Promise<Task> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('tasks')
                .insert(TaskMapper.toDbInsert(task as any))
                .select()
                .single();

            if (error) throw ErrorHandler.database('创建任务失败', error);

            return TaskMapper.fromDb(data);
        });
    },

    async update(updates: UpdateTaskInput): Promise<Task> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { id, ...updateFields } = updates;
            const dbUpdates = TaskMapper.toDb(updateFields);

            const { data, error } = await supabase
                .from('tasks')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw ErrorHandler.database('更新任务失败', error);
            if (!data) throw ErrorHandler.notFound('任务');

            return TaskMapper.fromDb(data);
        });
    },

    async delete(id: string): Promise<void> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw ErrorHandler.database('删除任务失败', error);
        });
    },
};

// Focus Sessions Service
export const focusSessionsService = {
    async getAll(): Promise<FocusSession[]> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('focus_sessions')
                .select('*')
                .order('started_at', { ascending: false });

            if (error) throw ErrorHandler.database('获取专注记录失败', error);

            return data.map(row => FocusSessionMapper.fromDb(row));
        });
    },

    async create(session: CreateFocusSessionInput): Promise<FocusSession> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('focus_sessions')
                .insert(FocusSessionMapper.toDbInsert(session as any))
                .select()
                .single();

            if (error) throw ErrorHandler.database('创建专注记录失败', error);

            return FocusSessionMapper.fromDb(data);
        });
    },

    async update(updates: UpdateFocusSessionInput): Promise<FocusSession> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { id, ...updateFields } = updates;
            const dbUpdates = FocusSessionMapper.toDb(updateFields);

            const { data, error } = await supabase
                .from('focus_sessions')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw ErrorHandler.database('更新专注记录失败', error);
            if (!data) throw ErrorHandler.notFound('专注记录');

            return FocusSessionMapper.fromDb(data);
        });
    },

    async delete(id: string): Promise<void> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { error } = await supabase
                .from('focus_sessions')
                .delete()
                .eq('id', id);

            if (error) throw ErrorHandler.database('删除专注记录失败', error);
        });
    },
};

// Transactions Service
export const transactionsService = {
    async getAll(): Promise<Transaction[]> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw ErrorHandler.database('获取交易记录失败', error);

            return data.map(row => ({
                ...TransactionMapper.fromDb(row),
                amount: parseFloat(row.amount),
            }));
        });
    },

    async create(transaction: CreateTransactionInput): Promise<Transaction> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('transactions')
                .insert(TransactionMapper.toDbInsert(transaction as any))
                .select()
                .single();

            if (error) throw ErrorHandler.database('创建交易记录失败', error);

            return {
                ...TransactionMapper.fromDb(data),
                amount: parseFloat(data.amount),
            };
        });
    },

    async update(updates: UpdateTransactionInput): Promise<Transaction> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { id, ...updateFields } = updates;
            const dbUpdates = TransactionMapper.toDb(updateFields);

            const { data, error } = await supabase
                .from('transactions')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw ErrorHandler.database('更新交易记录失败', error);
            if (!data) throw ErrorHandler.notFound('交易记录');

            return {
                ...TransactionMapper.fromDb(data),
                amount: parseFloat(data.amount),
            };
        });
    },

    async delete(id: string): Promise<void> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw ErrorHandler.database('删除交易记录失败', error);
        });
    },
};

// Journal Entries Service
export const journalEntriesService = {
    async getAll(): Promise<JournalEntry[]> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw ErrorHandler.database('获取日志记录失败', error);

            return data.map(row => JournalEntryMapper.fromDb(row));
        });
    },

    async create(entry: CreateJournalEntryInput): Promise<JournalEntry> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('journal_entries')
                .insert(JournalEntryMapper.toDbInsert(entry as any))
                .select()
                .single();

            if (error) throw ErrorHandler.database('创建日志记录失败', error);

            return JournalEntryMapper.fromDb(data);
        });
    },

    async update(updates: UpdateJournalEntryInput): Promise<JournalEntry> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { id, ...updateFields } = updates;
            const dbUpdates = JournalEntryMapper.toDb(updateFields);

            const { data, error } = await supabase
                .from('journal_entries')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw ErrorHandler.database('更新日志记录失败', error);
            if (!data) throw ErrorHandler.notFound('日志记录');

            return JournalEntryMapper.fromDb(data);
        });
    },

    async delete(id: string): Promise<void> {
        return safeAsync(async () => {
            const supabase = createClient();

            const { error } = await supabase
                .from('journal_entries')
                .delete()
                .eq('id', id);

            if (error) throw ErrorHandler.database('删除日志记录失败', error);
        });
    },
};
