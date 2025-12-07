'use client';

import React from 'react';
import { useGlobalState } from '@/hooks';
import { FinanceModule } from '@/components/modules/FinanceModule';

export default function FinancePage() {
    const { state, setTransactions } = useGlobalState();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <FinanceModule transactions={state.transactions} setTransactions={setTransactions} />
        </div>
    );
}
