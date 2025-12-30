import React from 'react';
import { Transaction, TransactionType } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionListProps {
    transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">最近记录</h3>
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                            <HugeiconsIcon icon={Wallet01Icon} className="w-8 h-8" />
                        </div>
                        <p>暂无交易记录</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">最近记录</h3>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                        {transactions.map(t => (
                            <div
                                key={t.id}
                                className="flex justify-between items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{t.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(t.timestamp), new Date(t.timestamp).getFullYear() !== new Date().getFullYear() ? 'yyyy/M/d HH:mm' : 'M/d HH:mm')}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`ml-3 font-mono text-base ${t.type === TransactionType.INCOME
                                            ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20'
                                            : 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-900/20'
                                        }`}
                                >
                                    {t.type === TransactionType.INCOME ? '+' : '-'}¥{t.amount.toFixed(2)}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
