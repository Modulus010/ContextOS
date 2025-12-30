import React from 'react';
import { format } from 'date-fns';

interface ActivityItemProps {
    item: {
        type: 'task' | 'focus' | 'transaction' | 'journal';
        data: any;
        time: number;
    };
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
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
        <div className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0 group">
            <div className="mt-1 relative">
                <div className={`w-2.5 h-2.5 rounded-full ${colorMap[item.type]} ring-4 ring-white dark:ring-slate-950`}></div>
                <div className="absolute top-2.5 left-1.5 w-px h-full bg-border -z-10 group-last:hidden"></div>
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{getText()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(item.time), new Date(item.time).getFullYear() !== new Date().getFullYear() ? 'yyyy/M/d HH:mm' : 'M/d HH:mm')}
                </p>
            </div>
        </div>
    );
};
