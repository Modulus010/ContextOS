/**
 * Server-Side Data Service
 * Data fetching functions for Server Components
 * Uses server-side Supabase client
 */

import { createClient } from '@/lib/supabase/server';
import {
    Task,
    FocusSession,
    Transaction,
    JournalEntry,
} from '@/types';
import {
    TaskMapper,
    FocusSessionMapper,
    TransactionMapper,
    JournalEntryMapper
} from '@/lib/mapping';

/**
 * Get all tasks from the database
 * For use in Server Components only
 */
export async function getTasks(): Promise<Task[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }

    return data.map(row => TaskMapper.fromDb(row));
}

/**
 * Get all focus sessions from the database
 * For use in Server Components only
 */
export async function getFocusSessions(): Promise<FocusSession[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching focus sessions:', error);
        return [];
    }

    return data.map(row => FocusSessionMapper.fromDb(row));
}

/**
 * Get all transactions from the database
 * For use in Server Components only
 */
export async function getTransactions(): Promise<Transaction[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data.map(row => TransactionMapper.fromDb(row));
}

/**
 * Get all journal entries from the database
 * For use in Server Components only
 */
export async function getJournalEntries(): Promise<JournalEntry[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching journal entries:', error);
        return [];
    }

    return data.map(row => JournalEntryMapper.fromDb(row));
}

/**
 * Get all data at once for the dashboard
 * Parallel fetching for better performance
 */
export async function getAllData() {
    const [tasks, focusSessions, transactions, journalEntries] = await Promise.all([
        getTasks(),
        getFocusSessions(),
        getTransactions(),
        getJournalEntries(),
    ]);

    return {
        tasks,
        focusSessions,
        transactions,
        journalEntries,
    };
}
