import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";

interface FinanceHeaderProps {
    totalBalance: number;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({ totalBalance }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                        <HugeiconsIcon icon={Wallet01Icon} className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">现金流</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            追踪价值交换
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">当前余额</p>
                    <p className={`text-3xl font-mono font-bold ${totalBalance >= 0 ? 'text-foreground' : 'text-destructive'
                        }`}>
                        ¥{totalBalance.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};
