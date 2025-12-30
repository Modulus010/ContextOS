import React, { useState } from 'react';
import { TransactionType, type TransactionTypeType } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useCreateTransaction } from '@/hooks/useSupabaseData';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const TransactionQuickAdd: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionTypeType>(TransactionType.EXPENSE);

    const createTransaction = useCreateTransaction();

    const addTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        await createTransaction.mutateAsync({
            amount: parseFloat(amount),
            description,
            type,
            category: 'General'
        });

        setAmount('');
        setDescription('');
    };

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">快速记账</h3>
                <form onSubmit={addTransaction} className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={() => setType(TransactionType.EXPENSE)}
                            variant={type === TransactionType.EXPENSE ? "default" : "outline"}
                            className={`flex-1 ${type === TransactionType.EXPENSE
                                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                    : 'hover:bg-rose-50 hover:text-rose-600'
                                }`}
                        >
                            💸 支出
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setType(TransactionType.INCOME)}
                            variant={type === TransactionType.INCOME ? "default" : "outline"}
                            className={`flex-1 ${type === TransactionType.INCOME
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                    : 'hover:bg-emerald-50 hover:text-emerald-600'
                                }`}
                        >
                            💰 收入
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="描述（例如：午餐、工资）"
                            className="flex-1"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="金额"
                            className="w-28"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="shrink-0">
                            <HugeiconsIcon icon={PlusSignIcon} />
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
