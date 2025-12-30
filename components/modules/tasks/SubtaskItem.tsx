import React from 'react';
import { Subtask } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { InlineEditor } from '@/components/common/InlineEditor';

interface SubtaskItemProps {
    subtask: Subtask;
    onToggle: (id: string) => void;
    onUpdate: (id: string, title: string) => void;
    onDelete: (id: string) => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({
    subtask,
    onToggle,
    onUpdate,
    onDelete
}) => {
    return (
        <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
            <Checkbox
                checked={subtask.completed}
                onCheckedChange={() => onToggle(subtask.id)}
            />
            <div className="flex-1">
                <InlineEditor
                    value={subtask.title}
                    onSave={(newTitle) => onUpdate(subtask.id, newTitle)}
                    onDelete={() => onDelete(subtask.id)}
                    placeholder="输入子任务..."
                    displayClassName={`text-sm ${
                        subtask.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                    }`}
                />
            </div>
        </div>
    );
};
