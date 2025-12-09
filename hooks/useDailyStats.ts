/**
 * useDailyStats Hook
 * Computes today's statistics from global state
 */

import { useMemo } from 'react';
import { GlobalState } from '../types';
import {
    getCompletedTasksToday,
    getFocusMinutesToday,
    getExpensesToday,
    getLatestMood,
} from '../utils';

export interface DailyStats {
    completedToday: number;
    focusMinutes: number;
    spentToday: number;
    latestMood: string;
}

export function useDailyStats(state: GlobalState): DailyStats {
    return useMemo(() => {
        const completedToday = getCompletedTasksToday(state.tasks).length;
        const focusMinutes = getFocusMinutesToday(state.focusSessions);
        const spentToday = getExpensesToday(state.transactions);
        const latestMood = getLatestMood(state.journalEntries);

        return {
            completedToday,
            focusMinutes,
            spentToday,
            latestMood
        };
    }, [state.tasks, state.focusSessions, state.transactions, state.journalEntries]);
}
