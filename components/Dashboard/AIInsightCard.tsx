import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";

interface AIInsightCardProps {
    insight: string;
    loading: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, loading }) => {
    return (
        <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-800 dark:to-violet-800 border-none text-white shadow-lg relative overflow-hidden min-h-32 md:min-h-40 flex flex-col justify-center flex-shrink-0">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <HugeiconsIcon icon={SparklesIcon} className="w-32 h-32" />
            </div>
            <CardContent className="relative z-10 p-4 md:p-6">
                <h3 className="font-semibold text-indigo-100 flex items-center gap-2 mb-2 text-sm md:text-base">
                    <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" /> Nexus 洞察
                </h3>
                <p className={`text-base md:text-lg font-medium leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
                    "{insight}"
                </p>
            </CardContent>
        </Card>
    );
};
