import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRightIcon, ArrowDownLeftIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceStatsCardsProps {
    totalIncome: number;
    totalExpense: number;
}

export const FinanceStatsCards: React.FC<FinanceStatsCardsProps> = ({ totalIncome, totalExpense }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">总收入</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                                ¥{totalIncome.toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-emerald-500/10">
                            <HugeiconsIcon icon={ArrowUpRightIcon} className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">总支出</p>
                            <p className="text-2xl font-bold text-rose-600 dark:text-rose-500">
                                ¥{totalExpense.toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-rose-500/10">
                            <HugeiconsIcon icon={ArrowDownLeftIcon} className="w-6 h-6 text-rose-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
