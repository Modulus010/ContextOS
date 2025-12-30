/**
 * Dashboard Component
 * Handles interactive features and AI insights
 */
'use client';

import React, { useEffect, useState } from 'react';
import { GlobalState, Task, FocusSession, Transaction, JournalEntry } from '@/types';
import { generateContextualInsight } from '@/services/aiService';
import { useDailyStats, useRecentActivities } from '@/hooks';
import { HugeiconsIcon } from "@hugeicons/react";
import { Task01Icon, Clock01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { AIInsightCard } from './Dashboard/AIInsightCard';
import { StatCard } from './Dashboard/StatCard';
import { ActivityFeed } from './Dashboard/ActivityFeed';

interface DashboardProps {
    tasks: Task[];
    focusSessions: FocusSession[];
    transactions: Transaction[];
    journalEntries: JournalEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({
    tasks,
    focusSessions,
    transactions,
    journalEntries
}) => {
    const [insight, setInsight] = useState<string>("正在分析您的上下文模式...");
    const [loading, setLoading] = useState(false);

    const state: GlobalState = {
        tasks,
        focusSessions,
        transactions,
        journalEntries
    };

    const stats = useDailyStats(state);
    const recentActivities = useRecentActivities(tasks, focusSessions, transactions, journalEntries, 10);

    useEffect(() => {
        const fetchInsight = async () => {
            if (tasks.length === 0 && focusSessions.length === 0) {
                setInsight("Nexus 已就绪。从添加任务或记录心情开始吧。");
                return;
            }
            setLoading(true);
            const text = await generateContextualInsight(state);
            setInsight(text);
            setLoading(false);
        };

        fetchInsight();
    }, [tasks.length, focusSessions.length, transactions.length, journalEntries.length]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">概览</h1>
                    <p className="text-muted-foreground mt-1">您的个人上下文操作系统</p>
                </div>
            </div>

            <AIInsightCard insight={insight} loading={loading} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={Task01Icon}
                    label="已完成任务"
                    value={stats.completedToday}
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    textColor="text-blue-500 dark:text-blue-400"
                />
                <StatCard
                    icon={Clock01Icon}
                    label="专注时间"
                    value={`${stats.focusMinutes}分钟`}
                    bgColor="bg-amber-50 dark:bg-amber-900/30"
                    textColor="text-amber-500 dark:text-amber-400"
                />
                <StatCard
                    icon={Wallet01Icon}
                    label="今日支出"
                    value={`¥${stats.spentToday}`}
                    bgColor="bg-emerald-50 dark:bg-emerald-900/30"
                    textColor="text-emerald-500 dark:text-emerald-400"
                />
            </div>

            <ActivityFeed activities={recentActivities} />
        </div>
    );
};
