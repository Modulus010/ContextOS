'use client';

import React from 'react';
import { Transaction, TransactionType } from '@/types';
import { Separator } from "@/components/ui/separator";
import { FinanceHeader, FinanceStatsCards, TransactionQuickAdd, TransactionList, BalanceChart } from './finance';

interface FinanceModuleProps {
    transactions: Transaction[];
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ transactions }) => {
    // Format time for chart tick labels
    const formatChartTime = (timestamp: number | string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const currentYear = now.getFullYear();
        const dateYear = date.getFullYear();

        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const timeStr = `${hours}:${minutes}`;
        const dateStr = `${month}/${day}`;

        if (dateYear !== currentYear) {
            return `${dateYear}/${dateStr}`;
        }

        return `${dateStr}`;
    };

    // Prepare recent transactions (oldest -> newest) for the last 30 days and compute running balance
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS);
    const recentTransactions = transactions
        .filter(t => new Date(t.timestamp) >= thirtyDaysAgo)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const startingBalance = transactions
        .filter(t => new Date(t.timestamp) < thirtyDaysAgo)
        .reduce((acc, curr) => (curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount), 0);

    let cumulative = startingBalance;
    const chartData = recentTransactions.map(t => {
        const delta = t.type === TransactionType.INCOME ? t.amount : -t.amount;
        cumulative += delta;
        return {
            timestamp: t.timestamp,
            name: new Date(t.timestamp).toLocaleDateString([], { month: '2-digit', day: '2-digit' }),
            balance: parseFloat(cumulative.toFixed(2)),
            delta: parseFloat(delta.toFixed(2)),
            type: t.type,
            description: t.description
        };
    });

    // Build line segments between adjacent points; color determined by the later point's delta
    const segments = chartData.length > 1
        ? chartData.slice(1).map((curr, i) => {
            const prev = chartData[i];
            const color = curr.delta >= 0 ? '#10b981' : '#f43f5e';
            return { data: [prev, curr], color };
        })
        : [];

    const totalBalance = transactions.reduce((acc, curr) => {
        return curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <FinanceHeader totalBalance={totalBalance} />
            <Separator />
            <FinanceStatsCards totalIncome={totalIncome} totalExpense={totalExpense} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <TransactionQuickAdd />
                    <TransactionList transactions={transactions} />
                </div>

                <BalanceChart
                    chartData={chartData}
                    segments={segments}
                    formatChartTime={formatChartTime}
                />
            </div>
        </div>
    );
};
