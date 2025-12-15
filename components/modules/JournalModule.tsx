import React, { useState } from 'react';
import { JournalEntry } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, SentIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { analyzeJournalEntry } from '@/services/aiService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface JournalModuleProps {
    entries: JournalEntry[];
    setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const MOODS = [
    { value: 'terrible', label: '😫', color: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' },
    { value: 'bad', label: '🙁', color: 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900' },
    { value: 'neutral', label: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    { value: 'good', label: '🙂', color: 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900' },
    { value: 'great', label: '🤩', color: 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900' }
];

export const JournalModule: React.FC<JournalModuleProps> = ({ entries, setEntries }) => {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsAnalyzing(true);

        const tempId = crypto.randomUUID();
        const newEntry: JournalEntry = {
            id: tempId,
            content,
            mood: mood as any,
            timestamp: Date.now(),
            aiReflection: "分析中..."
        };

        setEntries(prev => [newEntry, ...prev]);
        setContent('');

        const reflection = await analyzeJournalEntry(content, mood);

        setEntries(prev => prev.map(entry =>
            entry.id === tempId ? { ...entry, aiReflection: reflection } : entry
        ));
        setIsAnalyzing(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <HugeiconsIcon icon={BookOpen01Icon} className="text-violet-600 dark:text-violet-400" />
                    认知日志
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">外化思维以处理情绪</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col md:flex-row h-full overflow-hidden p-0">
                {/* Editor Area */}
                <div className="flex-1 p-6 flex flex-col border-r">
                    <div className="flex gap-2 mb-4 justify-center">
                        <ToggleGroup type="single" value={mood} onValueChange={(val) => val && setMood(val)}>
                            {MOODS.map(m => (
                                <ToggleGroupItem
                                    key={m.value}
                                    value={m.value}
                                    className={`w-10 h-10 rounded-full text-xl border-2 transition-all data-[state=on]:scale-110 data-[state=on]:shadow-sm ${mood === m.value ? m.color : 'border-transparent opacity-50 grayscale hover:grayscale-0'
                                        }`}
                                >
                                    {m.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="今天感觉如何？是什么转移了你的注意力？"
                        className="flex-1 w-full resize-none"
                    />

                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isAnalyzing}
                            className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                            {isAnalyzing ? '分析中...' : <>记录日志 <HugeiconsIcon icon={SentIcon} className="w-4 h-4 ml-2" /></>}
                        </Button>
                    </div>
                </div>

                {/* History Stream */}
                <div className="w-full md:w-80 bg-muted/30 overflow-y-auto p-4 space-y-4">
                    {entries.length === 0 && <p className="text-center text-muted-foreground mt-10">暂无记录。</p>}
                    {entries.map(entry => (
                        <Card key={entry.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase">
                                    {new Date(entry.timestamp).toLocaleDateString()}
                                </span>
                                <span className="text-lg">{MOODS.find(m => m.value === entry.mood)?.label}</span>
                            </div>
                            <p className="text-sm mb-3 whitespace-pre-wrap">{entry.content}</p>
                            {entry.aiReflection && (
                                <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg flex gap-3 items-start">
                                    <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-violet-800 dark:text-violet-200 italic">{entry.aiReflection}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
