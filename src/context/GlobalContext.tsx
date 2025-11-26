/**
 * Global State Context
 * 提供全应用范围内的状态管理，避免 prop drilling
 */

import React, { createContext, ReactNode } from 'react';
import { GlobalState, Task, FocusSession, Transaction, JournalEntry } from '../types';
import { useGlobalState as useGlobalStateHook } from '../hooks';

interface GlobalContextType {
    state: GlobalState;
    setTasks: (tasks: Task[]) => void;
    setSessions: (sessions: FocusSession[]) => void;
    setTransactions: (transactions: Transaction[]) => void;
    setJournalEntries: (entries: JournalEntry[]) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalStateProviderProps {
    children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
    const { state, setTasks, setSessions, setTransactions, setJournalEntries } = useGlobalStateHook();

    const value: GlobalContextType = {
        state,
        setTasks,
        setSessions,
        setTransactions,
        setJournalEntries
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

/**
 * Hook to use global state context
 */
export const useGlobalContext = (): GlobalContextType => {
    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within GlobalStateProvider');
    }
    return context;
};
