import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

export const JournalHeader: React.FC = () => {
    return (
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
    );
};
