import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalState } from '@/types';
import { generateContextualInsight } from '@/services/aiService';
import { useDailyStats } from '@/hooks';
import { Sparkles, LayoutDashboard, CheckSquare, Clock, Wallet } from 'lucide-react';
import { formatTime } from '@/utils';

interface DashboardProps {
    state: GlobalState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
    const [insight, setInsight] = useState<string>("正在分析您的上下文模式...");
    const [loading, setLoading] = useState(false);
    const stats = useDailyStats(state);

    useEffect(() => {
        const fetchInsight = async () => {
            if (state.tasks.length === 0 && state.focusSessions.length === 0) {
                setInsight("Nexus 已就绪。从添加任务或记录心情开始吧。");
                return;
            }
            setLoading(true);
            const text = await generateContextualInsight(state);
            setInsight(text);
            setLoading(false);
        };

        fetchInsight();
    }, [state.tasks.length, state.focusSessions.length, state.transactions.length, state.journalEntries.length]);

    const recentActivities = [
        ...state.tasks.filter(t => t.status === 'done').map(t => ({ type: 'task', data: t, time: t.completedAt })),
        ...state.focusSessions.map(s => ({ type: 'focus', data: s, time: s.timestamp })),
        ...state.transactions.map(t => ({ type: 'transaction', data: t, time: t.timestamp })),
        ...state.journalEntries.map(j => ({ type: 'journal', data: j, time: j.timestamp }))
    ].sort((a, b) => b.time - a.time).slice(0, 10);

    return (
        <div className="h-full flex flex-col gap-6 p-2 md:p-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-muted-foreground" />
                    <h1 className="text-2xl font-bold">上下文概览</h1>
                </div>
            </div>

            {/* AI Insight Card */}
            <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-800 dark:to-violet-800 border-none text-white shadow-lg relative overflow-hidden min-h-32 md:min-h-40 flex flex-col justify-center flex-shrink-0">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                </div>
                <CardContent className="relative z-10 p-4 md:p-6">
                    <h3 className="font-semibold text-indigo-100 flex items-center gap-2 mb-2 text-sm md:text-base">
                        <Sparkles className="w-4 h-4" /> Nexus 洞察
                    </h3>
                    <p className={`text-base md:text-lg font-medium leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
                        "{insight}"
                    </p>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={CheckSquare}
                    label="已完成任务"
                    value={stats.completedToday}
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    textColor="text-blue-500 dark:text-blue-400"
                />
                <StatCard
                    icon={Clock}
                    label="专注时间"
                    value={`${stats.focusMinutes}分钟`}
                    bgColor="bg-amber-50 dark:bg-amber-900/30"
                    textColor="text-amber-500 dark:text-amber-400"
                />
                <StatCard
                    icon={Wallet}
                    label="今日支出"
                    value={`$${stats.spentToday}`}
                    bgColor="bg-emerald-50 dark:bg-emerald-900/30"
                    textColor="text-emerald-500 dark:text-emerald-400"
                />
            </div>

            {/* Recent Activity Mini-Feed */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>活动流</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((item: any, idx) => (
                                <ActivityItem key={idx} item={item} />
                            ))
                        ) : (
                            <p className="text-muted-foreground italic text-sm">暂无活动记录。</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

interface StatCardProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | number;
    bgColor: string;
    textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, bgColor, textColor }) => (
    <Card className="flex items-center justify-between p-6 transition-colors">
        <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
            <Icon className="w-6 h-6" />
        </div>
    </Card>
);

interface ActivityItemProps {
    item: {
        type: 'task' | 'focus' | 'transaction' | 'journal';
        data: any;
        time: number;
    };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
    const colorMap = {
        task: 'bg-blue-500',
        focus: 'bg-amber-500',
        transaction: 'bg-emerald-500',
        journal: 'bg-violet-500',
    };

    const getText = () => {
        switch (item.type) {
            case 'task':
                return `完成任务：${item.data.title}`;
            case 'focus':
                return `专注了 ${Math.floor(item.data.durationSeconds / 60)} 分钟`;
            case 'transaction':
                return `${item.data.type === 'income' ? '收入' : '支出'}：¥${item.data.amount} (${item.data.description})`;
            case 'journal':
                return `记录心情：${item.data.mood}`;
            default:
                return '';
        }
    };

    return (
        <div className="flex gap-4 items-start pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${colorMap[item.type]}`}></div>
            </div>
            <div>
                <p className="text-sm text-slate-800 dark:text-slate-200">{getText()}</p>
                <p className="text-xs text-slate-400">{formatTime(item.time)}</p>
            </div>
        </div>
    );
};
