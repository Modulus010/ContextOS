import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Task01Icon } from "@hugeicons/core-free-icons";

export const TaskHeader: React.FC = () => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <HugeiconsIcon icon={Task01Icon} className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">任务流</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        捕捉任务以减轻认知负担
                    </p>
                </div>
            </div>
        </div>
    );
};
