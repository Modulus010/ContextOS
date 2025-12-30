import React, { useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { analyzeJournalEntry } from '@/services/aiService';
import { useCreateJournalEntry, useUpdateJournalEntry } from '@/hooks/useSupabaseData';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoodSelector } from './MoodSelector';

interface JournalEditorProps {
    onEntryCreated?: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ onEntryCreated }) => {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const createEntry = useCreateJournalEntry();
    const updateEntry = useUpdateJournalEntry();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsAnalyzing(true);

        const newEntry = await createEntry.mutateAsync({
            content,
            mood: mood as any,
            aiReflection: "分析中..."
        });

        setContent('');
        
        const reflection = await analyzeJournalEntry(content, mood);

        await updateEntry.mutateAsync({
            id: newEntry.id,
            aiReflection: reflection
        });

        setIsAnalyzing(false);
        onEntryCreated?.();
    };

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <MoodSelector selectedMood={mood} onMoodSelect={setMood} />
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
    );
};
