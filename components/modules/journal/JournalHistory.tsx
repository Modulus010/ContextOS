import React from 'react';
import { JournalEntry } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOODS } from './MoodSelector';

interface JournalHistoryProps {
    entries: JournalEntry[];
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({ entries }) => {
    if (entries.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">历史记录</h3>
                    <div className="text-center py-12">
                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                            <HugeiconsIcon icon={BookOpen01Icon} className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">暂无记录</p>
                        <p className="text-xs text-muted-foreground mt-2">开始记录你的第一篇日志吧</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">历史记录</h3>
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                        {entries.map(entry => {
                            const moodData = MOODS.find(m => m.value === entry.mood);
                            return (
                                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    {new Date(entry.timestamp).toLocaleDateString('zh-CN', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday: 'short'
                                                    })}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(entry.timestamp).toLocaleTimeString('zh-CN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`text-lg ${moodData?.color}`}
                                            >
                                                {moodData?.label}
                                            </Badge>
                                        </div>

                                        <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                                            {entry.content}
                                        </p>

                                        {entry.aiReflection && (
                                            <>
                                                <Separator />
                                                <div className="bg-violet-50 dark:bg-violet-900/10 p-3 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <HugeiconsIcon
                                                            icon={SparklesIcon}
                                                            className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0"
                                                        />
                                                        <p className="text-sm text-violet-900 dark:text-violet-100 leading-relaxed">
                                                            {entry.aiReflection}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
