import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";

interface FocusHeaderProps {
    focusMinutesToday: number;
}

export const FocusHeader: React.FC<FocusHeaderProps> = ({ focusMinutesToday }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <HugeiconsIcon icon={Clock01Icon} className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">深度工作</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            单任务处理以减少认知残留
                        </p>
                    </div>
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                    今日 {focusMinutesToday} 分钟
                </Badge>
            </div>
        </div>
    );
};
