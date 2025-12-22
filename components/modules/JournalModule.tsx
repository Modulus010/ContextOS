import React, { useState } from 'react';
import { JournalEntry } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, SentIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { analyzeJournalEntry } from '@/services/aiService';
import { useCreateJournalEntry, useUpdateJournalEntry } from '@/hooks/useSupabaseData';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface JournalModuleProps {
    entries: JournalEntry[];
}

const MOODS = [
    { value: 'terrible', label: '😫', color: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' },
    { value: 'bad', label: '🙁', color: 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900' },
    { value: 'neutral', label: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    { value: 'good', label: '🙂', color: 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900' },
    { value: 'great', label: '🤩', color: 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900' }
];

export const JournalModule: React.FC<JournalModuleProps> = ({ entries }) => {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);

    const createEntry = useCreateJournalEntry();
    const updateEntry = useUpdateJournalEntry();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsAnalyzing(true);

        // Create entry with initial placeholder
        const newEntry = await createEntry.mutateAsync({
            content,
            mood: mood as any,
            aiReflection: "分析中..."
        });

        setPendingEntryId(newEntry.id);
        setContent('');

        // Get AI reflection and update
        const reflection = await analyzeJournalEntry(content, mood);

        await updateEntry.mutateAsync({
            id: newEntry.id,
            aiReflection: reflection
        });

        setPendingEntryId(null);
        setIsAnalyzing(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                        <HugeiconsIcon icon={BookOpen01Icon} className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">认知日志</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            外化思维以处理情绪
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor Area */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">今天的心情如何？</label>
                                <div className="flex gap-3 justify-center">
                                    {MOODS.map(m => (
                                        <button
                                            key={m.value}
                                            type="button"
                                            onClick={() => setMood(m.value)}
                                            className={`w-14 h-14 rounded-full text-2xl border-2 transition-all hover:scale-110 active:scale-95 ${mood === m.value
                                                ? `${m.color} scale-110 shadow-md`
                                                : 'border-muted opacity-40 hover:opacity-100 hover:border-muted-foreground'
                                                }`}
                                            aria-label={m.value}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <label className="block text-sm font-medium">记录你的想法</label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="今天感觉如何？是什么转移了你的注意力？&#10;&#10;尽情表达你的想法和感受..."
                                    className="min-h-[300px] resize-none text-base leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!content.trim() || isAnalyzing}
                                    size="lg"
                                    className="bg-violet-600 hover:bg-violet-700 text-white"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 mr-2 animate-pulse" />
                                            AI 分析中...
                                        </>
                                    ) : (
                                        <>
                                            <HugeiconsIcon icon={SentIcon} className="w-4 h-4 mr-2" />
                                            记录日志
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Stream */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">历史记录</h3>
                            <ScrollArea className="h-[600px] pr-4">
                                {entries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                                            <HugeiconsIcon icon={BookOpen01Icon} className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground text-sm">暂无记录</p>
                                        <p className="text-xs text-muted-foreground mt-2">开始记录你的第一篇日志吧</p>
                                    </div>
                                ) : (
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
                                                                        <p className="text-xs text-violet-900 dark:text-violet-200 leading-relaxed italic">
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
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
