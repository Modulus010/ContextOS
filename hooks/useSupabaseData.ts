/**
 * React Query Hooks
 * Custom hooks for data fetching and mutations using React Query
 * Improved with better optimistic updates and error handling
 */

'use client';

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import {
    Task,
    FocusSession,
    Transaction,
    JournalEntry,
    UpdateTaskInput,
    UpdateFocusSessionInput,
    UpdateTransactionInput,
    UpdateJournalEntryInput,
} from '@/types';
import {
    tasksService,
    focusSessionsService,
    transactionsService,
    journalEntriesService,
} from '@/services/dataService';
import { handleClientError } from '@/lib/errors';

// Query Keys
const QUERY_KEYS = {
    TASKS: ['tasks'] as const,
    FOCUS_SESSIONS: ['focus_sessions'] as const,
    TRANSACTIONS: ['transactions'] as const,
    JOURNAL_ENTRIES: ['journal_entries'] as const,
};

// Generate optimistic IDs with a prefix to avoid conflicts
const generateOptimisticId = () => `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generic optimistic update helper
function createOptimisticMutation<TData, TVariables, TContext = unknown>(
    queryKey: QueryKey,
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: {
        onMutate?: (variables: TVariables, queryClient: any) => Promise<TContext>;
        onError?: (error: unknown, variables: TVariables, context: TContext | undefined) => void;
        shouldInvalidate?: boolean;
    } = {}
) {
    return {
        mutationFn,
        onMutate: async (variables: TVariables) => {
            const queryClient = options.onMutate ?
                await (options.onMutate as any)(variables) : undefined;
            return queryClient;
        },
        onError: (error: unknown, variables: TVariables, context: TContext | undefined) => {
            console.error('Mutation error:', error);
            if (options.onError) {
                options.onError(error, variables, context);
            }
        },
        onSuccess: (_data: TData, _variables: TVariables, _context: TContext | undefined) => {
            // Only invalidate if needed (default: true)
            if (options.shouldInvalidate !== false) {
                // Invalidation is handled by queryClient in the hook
            }
        },
    };
}

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
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

            // Optimistically update with a unique ID
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) => [
                {
                    ...newTask,
                    id: generateOptimisticId(),
                    createdAt: new Date().toISOString(),
                    completedAt: undefined,
                    deadline: newTask.deadline,
                    tags: newTask.tags || [],
                    subtasks: newTask.subtasks || [],
                } as Task,
                ...old,
            ]);

            return { previousTasks };
        },
        onError: (error, _newTask, context) => {
            // Revert on error
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            console.error('Create task error:', handleClientError(error, '创建任务失败'));
        },
        onSuccess: () => {
            // Replace optimistic data with server data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: UpdateTaskInput) =>
            tasksService.update(updates),
        onMutate: async (updates) => {
            const { id, ...updateFields } = updates;
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
            const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

            // Optimistically update
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) =>
                old.map(task =>
                    task.id === id
                        ? { ...task, ...updateFields }
                        : task
                )
            );

            return { previousTasks };
        },
        onError: (error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            console.error('Update task error:', handleClientError(error, '更新任务失败'));
        },
        onSuccess: (_data, variables) => {
            // Only update the specific task instead of invalidating all
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) =>
                old.map(task => task.id === variables.id ? _data : task)
            );
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

            // Optimistically remove
            queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old = []) =>
                old.filter(task => task.id !== id)
            );

            return { previousTasks };
        },
        onError: (error, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            console.error('Delete task error:', handleClientError(error, '删除任务失败'));
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
                {
                    ...newSession,
                    id: generateOptimisticId(),
                    startedAt: new Date().toISOString(),
                } as FocusSession,
                ...old,
            ]);

            return { previousSessions };
        },
        onError: (error, _newSession, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
            console.error('Create session error:', handleClientError(error, '创建专注记录失败'));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
        },
    });
}

export function useUpdateFocusSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: UpdateFocusSessionInput) =>
            focusSessionsService.update(updates),
        onMutate: async (updates) => {
            const { id, ...updateFields } = updates;
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FOCUS_SESSIONS });
            const previousSessions = queryClient.getQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS);

            queryClient.setQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS, (old = []) =>
                old.map(session => session.id === id ? { ...session, ...updateFields } : session)
            );

            return { previousSessions };
        },
        onError: (error, _variables, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
            console.error('Update session error:', handleClientError(error, '更新专注记录失败'));
        },
        onSuccess: (_data, variables) => {
            queryClient.setQueryData<FocusSession[]>(QUERY_KEYS.FOCUS_SESSIONS, (old = []) =>
                old.map(session => session.id === variables.id ? _data : session)
            );
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
        onError: (error, _id, context) => {
            if (context?.previousSessions) {
                queryClient.setQueryData(QUERY_KEYS.FOCUS_SESSIONS, context.previousSessions);
            }
            console.error('Delete session error:', handleClientError(error, '删除专注记录失败'));
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
                {
                    ...newTransaction,
                    id: generateOptimisticId(),
                    timestamp: new Date().toISOString(),
                } as Transaction,
                ...old,
            ]);

            return { previousTransactions };
        },
        onError: (error, _newTransaction, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
            console.error('Create transaction error:', handleClientError(error, '创建交易记录失败'));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
        },
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: UpdateTransactionInput) =>
            transactionsService.update(updates),
        onMutate: async (updates) => {
            const { id, ...updateFields } = updates;
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
            const previousTransactions = queryClient.getQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS);

            queryClient.setQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS, (old = []) =>
                old.map(transaction => transaction.id === id ? { ...transaction, ...updateFields } : transaction)
            );

            return { previousTransactions };
        },
        onError: (error, _variables, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
            console.error('Update transaction error:', handleClientError(error, '更新交易记录失败'));
        },
        onSuccess: (_data, variables) => {
            queryClient.setQueryData<Transaction[]>(QUERY_KEYS.TRANSACTIONS, (old = []) =>
                old.map(transaction => transaction.id === variables.id ? _data : transaction)
            );
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
        onError: (error, _id, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS, context.previousTransactions);
            }
            console.error('Delete transaction error:', handleClientError(error, '删除交易记录失败'));
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
                {
                    ...newEntry,
                    id: generateOptimisticId(),
                    timestamp: new Date().toISOString(),
                } as JournalEntry,
                ...old,
            ]);

            return { previousEntries };
        },
        onError: (error, _newEntry, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
            console.error('Create entry error:', handleClientError(error, '创建日志记录失败'));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
        },
    });
}

export function useUpdateJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: UpdateJournalEntryInput) =>
            journalEntriesService.update(updates),
        onMutate: async (updates) => {
            const { id, ...updateFields } = updates;
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOURNAL_ENTRIES });
            const previousEntries = queryClient.getQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES);

            queryClient.setQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES, (old = []) =>
                old.map(entry => entry.id === id ? { ...entry, ...updateFields } : entry)
            );

            return { previousEntries };
        },
        onError: (error, _variables, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
            console.error('Update entry error:', handleClientError(error, '更新日志记录失败'));
        },
        onSuccess: (_data, variables) => {
            queryClient.setQueryData<JournalEntry[]>(QUERY_KEYS.JOURNAL_ENTRIES, (old = []) =>
                old.map(entry => entry.id === variables.id ? _data : entry)
            );
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
        onError: (error, _id, context) => {
            if (context?.previousEntries) {
                queryClient.setQueryData(QUERY_KEYS.JOURNAL_ENTRIES, context.previousEntries);
            }
            console.error('Delete entry error:', handleClientError(error, '删除日志记录失败'));
        },
    });
}
