import React from 'react';
import { Subtask } from '@/types';
import { SubtaskItem } from './SubtaskItem';
import { InlineEditor } from '@/components/common/InlineEditor';

interface SubtaskListProps {
    subtasks: Subtask[];
    onToggle: (id: string) => void;
    onUpdate: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onAdd: (title: string) => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
    subtasks,
    onToggle,
    onUpdate,
    onDelete,
    onAdd
}) => {
    return (
        <div className="px-4 pb-4 pt-3 space-y-2">
            {subtasks?.map(st => (
                <SubtaskItem
                    key={st.id}
                    subtask={st}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}

            {/* Add Subtask */}
            <div className="py-2 px-3">
                <InlineEditor
                    value=""
                    onSave={onAdd}
                    placeholder="输入子任务..."
                />
            </div>
        </div>
    );
};
