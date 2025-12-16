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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
            tasksService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tasksService.delete,
        onSuccess: () => {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

export function useUpdateFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<FocusSession> }) =>
            focusSessionsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

export function useDeleteFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: focusSessionsService.delete,
        onSuccess: () => {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
            transactionsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsService.delete,
        onSuccess: () => {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}

export function useUpdateJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) =>
            journalEntriesService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}

export function useDeleteJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: journalEntriesService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}
