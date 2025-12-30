import React from 'react';
import { Metadata } from 'next';
import { getTransactions } from '@/services/serverDataService';
import { FinanceModule } from '@/components/modules/FinanceModule';

export const metadata: Metadata = {
    title: '财务管理 - Nexus',
    description: '跟踪您的收入和支出',
};

export default async function FinancePage() {
    const transactions = await getTransactions();

    return (
        <FinanceModule transactions={transactions} />
    );
}
