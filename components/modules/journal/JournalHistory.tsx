import React, { useState } from 'react';
import { JournalEntry } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, SparklesIcon, ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOODS } from './MoodSelector';

interface JournalHistoryProps {
    entries: JournalEntry[];
}

const JournalEntryItem: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const moodData = MOODS.find(m => m.value === entry.mood);
    const shouldTruncate = entry.content.length > 150;

    return (
        <Card className="hover:shadow-md transition-shadow">
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

                <div>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''
                        }`}>
                        {entry.content}
                    </p>
                    {shouldTruncate && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 h-auto py-1 px-2 text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
                        >
                            <HugeiconsIcon
                                icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                                className="w-3 h-3 mr-1"
                            />
                            {isExpanded ? '收起' : '展开全文'}
                        </Button>
                    )}
                </div>

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
};

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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">历史记录</h3>
                    <Badge variant="secondary" className="text-xs">
                        {entries.length} 条
                    </Badge>
                </div>
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                    <div className="space-y-4">
                        {entries.map(entry => (
                            <JournalEntryItem key={entry.id} entry={entry} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
