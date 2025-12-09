/**
 * useGlobalState Hook
 * Manages all global application state with persistence
 */

import { useState, useCallback } from 'react';
import { GlobalState, Task, FocusSession, Transaction, JournalEntry } from '../types';
import { STORAGE_KEYS } from '../constants';
import { useLocalStorage } from './useLocalStorage';

export function useGlobalState(): {
    state: GlobalState;
    setTasks: (tasks: Task[]) => void;
    setSessions: (sessions: FocusSession[]) => void;
    setTransactions: (transactions: Transaction[]) => void;
    setJournalEntries: (entries: JournalEntry[]) => void;
} {
    const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
    const [focusSessions, setSessions] = useLocalStorage<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, []);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);

    const state: GlobalState = {
        tasks,
        focusSessions,
        transactions,
        journalEntries
    };

    return {
        state,
        setTasks,
        setSessions,
        setTransactions,
        setJournalEntries
    };
}
