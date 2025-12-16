'use client';

import React from 'react';
import { useTransactions } from '@/hooks/useSupabaseData';
import { FinanceModule } from '@/components/modules/FinanceModule';

export default function FinancePage() {
    const { data: transactions = [], isLoading } = useTransactions();

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载中...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <FinanceModule transactions={transactions} />
        </div>
    );
}
