import React, { useState } from 'react';
import { Transaction, TransactionType } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, TrendingUpIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTime } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FinanceModuleProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ transactions, setTransactions }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            amount: parseFloat(amount),
            description,
            type,
            category: 'General',
            timestamp: Date.now()
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setAmount('');
        setDescription('');
    };

    // Prepare recent transactions (oldest -> newest) for the last 30 days and compute running balance
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const recentTransactions = transactions
        .filter(t => t.timestamp >= now - THIRTY_DAYS)
        .sort((a, b) => a.timestamp - b.timestamp);

    const startingBalance = transactions
        .filter(t => t.timestamp < now - THIRTY_DAYS)
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

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader>
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <HugeiconsIcon icon={Wallet01Icon} className="text-emerald-600 dark:text-emerald-500" />
                        现金流
                    </CardTitle>
                    <CardDescription>追踪价值交换</CardDescription>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">余额</p>
                    <p className={`text-2xl font-mono font-bold ${totalBalance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                        ¥{totalBalance.toFixed(2)}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
                {/* Left: Input & List */}
                <div className="flex flex-col h-full overflow-hidden">
                    <Card className="mb-4 bg-muted/30">
                        <CardContent className="p-4">
                            <form onSubmit={addTransaction}>
                                <div className="flex gap-2 mb-2">
                                    <ToggleGroup type="single" value={type} onValueChange={(val) => val && setType(val as TransactionType)} className="w-full">
                                        <ToggleGroupItem value={TransactionType.EXPENSE} className="flex-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-700 dark:data-[state=on]:bg-rose-900/50 dark:data-[state=on]:text-rose-300">
                                            支出
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value={TransactionType.INCOME} className="flex-1 data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700 dark:data-[state=on]:bg-emerald-900/50 dark:data-[state=on]:text-emerald-300">
                                            收入
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="描述"
                                        className="flex-1"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="¥"
                                        className="w-20"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                    <Button type="submit" size="icon">
                                        <HugeiconsIcon icon={PlusSignIcon} className="w-5 h-5" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-card border rounded-lg text-sm transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-medium">{t.description}</span>
                                    <span className="text-xs text-muted-foreground">{formatTime(t.timestamp)}</span>
                                </div>
                                <span className={`font-mono font-medium ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}¥{t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visualization */}
                <Card className="bg-muted/30 flex flex-col">
                    <CardContent className="p-4 flex flex-col h-full">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                            <HugeiconsIcon icon={TrendingUpIcon} className="w-4 h-4" /> 余额变化
                        </h3>
                        <div className="flex-1 min-h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" />
                                    <XAxis
                                        dataKey="timestamp"
                                        type="number"
                                        scale="time"
                                        domain={["dataMin", "dataMax"]}
                                        tickFormatter={formatTime}
                                        tick={{ fill: '#94a3b8' }}
                                    />
                                    <YAxis tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: '#0ea5a4', strokeWidth: 1 }}
                                    />
                                    {segments.map((seg, idx) => (
                                        <Line key={idx} data={seg.data} dataKey="balance" stroke={seg.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                                    ))}
                                    <Line
                                        data={chartData}
                                        dataKey="balance"
                                        stroke="transparent"
                                        dot={(dotProps) => {
                                            const { cx, cy, payload } = dotProps as any;
                                            if (cx == null || cy == null) return null;
                                            const fill = payload.delta >= 0 ? '#10b981' : '#f43f5e';
                                            return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={1} />;
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            消费影响心理安全感。请有意识地记录。
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};
