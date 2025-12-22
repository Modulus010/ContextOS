import React, { useState } from 'react';
import { Transaction, TransactionType, type TransactionTypeType } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, PlusSignIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from "@hugeicons/core-free-icons";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useCreateTransaction } from '@/hooks/useSupabaseData';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinanceModuleProps {
    transactions: Transaction[];
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ transactions }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionTypeType>(TransactionType.EXPENSE);

    const createTransaction = useCreateTransaction();

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

    // Custom tooltip to show change details
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;
        // prefer original payload object if present
        const p = payload[0].payload || payload[0];
        const dateLabel = label ? new Date(label).toLocaleString() : p?.name;
        const delta = p?.delta ?? 0;
        const isIncome = delta >= 0;
        const deltaColor = isIncome ? '#10b981' : '#f43f5e';
        return (
            <div style={{ padding: 12, borderRadius: 8, background: '#0f172a', color: '#e2e8f0', boxShadow: '0 6px 18px rgba(2,6,23,0.6)' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{dateLabel}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>余额: ¥{Number(p?.balance ?? 0).toFixed(2)}</div>
                <div style={{ fontSize: 13, color: deltaColor, marginTop: 6 }}>变化: {delta >= 0 ? '+' : '-'}¥{Math.abs(Number(delta)).toFixed(2)}</div>
                {p?.description && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>记录: {p.description}</div>}
            </div>
        );
    };

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
            {/* Header Section */}
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

            <Separator />

            {/* Stats Cards */}
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Quick Add & Transaction List */}
                <div className="space-y-6">
                    {/* Quick Add Form */}
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

                    {/* Transaction List */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">最近记录</h3>
                            <ScrollArea className="h-[400px] pr-4">
                                {transactions.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                                            <HugeiconsIcon icon={Wallet01Icon} className="w-8 h-8" />
                                        </div>
                                        <p>暂无交易记录</p>
                                    </div>
                                ) : (
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
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Visualization */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <HugeiconsIcon icon={Wallet01Icon} className="w-5 h-5" />
                            余额变化趋势
                        </h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" className="dark:opacity-20" />
                                    <XAxis
                                        dataKey="timestamp"
                                        type="number"
                                        scale="time"
                                        domain={["dataMin", "dataMax"]}
                                        tickFormatter={formatChartTime}
                                        tick={{ fill: '#94a3b8' }}
                                        fontSize={12}
                                    />
                                    <YAxis
                                        tick={{ fill: '#94a3b8' }}
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: '#0ea5a4', strokeWidth: 1 }}
                                    />
                                    {segments.map((seg, idx) => (
                                        <Line
                                            key={idx}
                                            data={seg.data}
                                            dataKey="balance"
                                            stroke={seg.color}
                                            strokeWidth={3}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    ))}
                                    <Line
                                        data={chartData}
                                        dataKey="balance"
                                        stroke="transparent"
                                        dot={(dotProps) => {
                                            const { cx, cy, payload } = dotProps as any;
                                            if (cx == null || cy == null) return null;
                                            const fill = payload.delta >= 0 ? '#10b981' : '#f43f5e';
                                            return <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />;
                                        }}
                                        activeDot={{ r: 7, strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-6 text-xs text-center text-muted-foreground">
                            💡 消费影响心理安全感。请有意识地记录。
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
