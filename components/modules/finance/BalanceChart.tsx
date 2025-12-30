import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface BalanceChartProps {
    chartData: any[];
    segments: any[];
    formatChartTime: (timestamp: number | string) => string;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({
    chartData,
    segments,
    formatChartTime
}) => {
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;
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

    return (
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
    );
};
