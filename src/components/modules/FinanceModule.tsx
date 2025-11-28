import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { IconWallet, IconTrendingUp, IconPlus } from '../Icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTime } from '@/utils';

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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <IconWallet className="text-emerald-600 dark:text-emerald-500" />
                        现金流
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">追踪价值交换。</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">余额</p>
                    <p className={`text-2xl font-mono font-bold ${totalBalance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'}`}>
                        ¥{totalBalance.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
                {/* Left: Input & List */}
                <div className="flex flex-col h-full overflow-hidden">
                    <form onSubmit={addTransaction} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 transition-colors">
                        <div className="flex gap-2 mb-2">
                            <button
                                type="button"
                                onClick={() => setType(TransactionType.EXPENSE)}
                                className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${type === TransactionType.EXPENSE
                                    ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                                    : 'bg-white dark:bg-slate-700 text-slate-400'
                                    }`}
                            >
                                支出
                            </button>
                            <button
                                type="button"
                                onClick={() => setType(TransactionType.INCOME)}
                                className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${type === TransactionType.INCOME
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-white dark:bg-slate-700 text-slate-400'
                                    }`}
                            >
                                收入
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="描述"
                                className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="¥"
                                className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                            <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600">
                                <IconPlus className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-sm transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{t.description}</span>
                                    <span className="text-xs text-slate-400">{formatTime(t.timestamp)}</span>
                                </div>
                                <span className={`font-mono font-medium ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}¥{t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visualization */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col transition-colors">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <IconTrendingUp className="w-4 h-4" /> 余额变化
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
                                {/* Render each adjacent segment with its color (color determined by the later point) */}
                                {segments.map((seg, idx) => (
                                    <Line key={idx} data={seg.data} dataKey="balance" stroke={seg.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                                ))}
                                {/* Transparent line to render colored dots by payload */}
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
                    <div className="mt-4 text-xs text-slate-400 text-center">
                        消费影响心理安全感。请有意识地记录。
                    </div>
                </div>
            </div>
        </div>
    );
};
