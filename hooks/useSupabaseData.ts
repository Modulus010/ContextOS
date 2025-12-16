/**
 * React Query Hooks
 * Custom hooks for data fetching and mutations using React Query
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, FocusSession, Transaction, JournalEntry } from '@/types';
import {
    tasksService,
    focusSessionsService,
    transactionsService,
    journalEntriesService,
} from '@/services/dataService';

// Query Keys
const QUERY_KEYS = {
    TASKS: ['tasks'],
    FOCUS_SESSIONS: ['focus_sessions'],
    TRANSACTIONS: ['transactions'],
    JOURNAL_ENTRIES: ['journal_entries'],
};

// Tasks Hooks
export function useTasks() {
    return useQuery({
        queryKey: QUERY_KEYS.TASKS,
        queryFn: tasksService.getAll,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tasksService.create,
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
            const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
            
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) => [
                ...old,
                { 
                    ...newTask, 
                    id: `temp-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    completedAt: undefined
                } as Task
            ]);
            
            return { previousTasks };
        },
        onError: (_err, _newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
            tasksService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
            const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
            
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) =>
                old.map(task => task.id === id ? { ...task, ...updates } : task)
            );
            
            return { previousTasks };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tasksService.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
            const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
            
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) =>
                old.filter(task => task.id !== id)
            );
            
            return { previousTasks };
        },
        onError: (_err, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

// Focus Sessions Hooks
export function useFocusSessions() {
    return useQuery({
        queryKey: QUERY_KEYS.FOCUS_SESSIONS,
        queryFn: focusSessionsService.getAll,
    });
}

export function useCreateFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: focusSessionsService.create,
        onMutate: async (newSession) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
            const previousSessions = queryClient.getQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS);
            
            queryClient.setQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS, (old = []) => [
                ...old,
                { 
                    ...newSession, 
                    id: `temp-${Date.now()}`,
                    startedAt: new Date().toISOString()
                } as FocusSession
            ]);
            
            return { previousSessions };
        },
        onError: (_err, _newSession, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

export function useUpdateFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<FocusSession> }) =>
            focusSessionsService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
            const previousSessions = queryClient.getQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS);
            
            queryClient.setQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS, (old = []) =>
                old.map(session => session.id === id ? { ...session, ...updates } : session)
            );
            
            return { previousSessions };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

export function useDeleteFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: focusSessionsService.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
            const previousSessions = queryClient.getQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS);
            
            queryClient.setQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS, (old = []) =>
                old.filter(session => session.id !== id)
            );
            
            return { previousSessions };
        },
        onError: (_err, _id, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

// Transactions Hooks
export function useTransactions() {
    return useQuery({
        queryKey: QUERY_KEYS.TRANSACTIONS,
        queryFn: transactionsService.getAll,
    });
}

export function useCreateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsService.create,
        onMutate: async (newTransaction) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
            const previousTransactions = queryClient.getQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS);
            
            queryClient.setQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS, (old = []) => [
                ...old,
                { 
                    ...newTransaction, 
                    id: `temp-${Date.now()}`,
                    timestamp: new Date().toISOString()
                } as Transaction
            ]);
            
            return { previousTransactions };
        },
        onError: (_err, _newTransaction, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
            transactionsService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
            const previousTransactions = queryClient.getQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS);
            
            queryClient.setQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS, (old = []) =>
                old.map(transaction => transaction.id === id ? { ...transaction, ...updates } : transaction)
            );
            
            return { previousTransactions };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsService.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
            const previousTransactions = queryClient.getQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS);
            
            queryClient.setQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS, (old = []) =>
                old.filter(transaction => transaction.id !== id)
            );
            
            return { previousTransactions };
        },
        onError: (_err, _id, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

// Journal Entries Hooks
export function useJournalEntries() {
    return useQuery({
        queryKey: QUERY_KEYS.JOURNAL_ENTRIES,
        queryFn: journalEntriesService.getAll,
    });
}

export function useCreateJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: journalEntriesService.create,
        onMutate: async (newEntry) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
            const previousEntries = queryClient.getQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES);
            
            queryClient.setQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES, (old = []) => [
                ...old,
                { 
                    ...newEntry, 
                    id: `temp-${Date.now()}`,
                    timestamp: new Date().toISOString()
                } as JournalEntry
            ]);
            
            return { previousEntries };
        },
        onError: (_err, _newEntry, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}

export function useUpdateJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) =>
            journalEntriesService.update(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
            const previousEntries = queryClient.getQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES);
            
            queryClient.setQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES, (old = []) =>
                old.map(entry => entry.id === id ? { ...entry, ...updates } : entry)
            );
            
            return { previousEntries };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}

export function useDeleteJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: journalEntriesService.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
            const previousEntries = queryClient.getQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES);
            
            queryClient.setQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES, (old = []) =>
                old.filter(entry => entry.id !== id)
            );
            
            return { previousEntries };
        },
        onError: (_err, _id, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}
