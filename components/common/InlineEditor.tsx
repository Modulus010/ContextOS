'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface InlineEditorProps {
    value: string;
    onSave: (value: string) => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    displayClassName?: string;
    autoFocus?: boolean;
    allowEmpty?: boolean;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
    value,
    onSave,
    onDelete,
    placeholder = '输入内容...',
    className = '',
    inputClassName = '',
    displayClassName = '',
    autoFocus = false,
    allowEmpty = false,
}) => {
    const [isEditing, setIsEditing] = useState(autoFocus);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = async () => {
        setIsEditing(false);
        setEditValue(value);

        const trimmedValue = editValue.trim();
        if (!trimmedValue && !allowEmpty) {
            if (onDelete) {
                await onDelete();
            }
            return;
        }

        if (trimmedValue !== value) {
            await onSave(trimmedValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current?.blur();
        }
    };

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`${inputClassName} ${className}`}
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`cursor-text ${displayClassName} ${className}`}
        >
            {value || <span className="text-muted-foreground">{placeholder}</span>}
        </div>
    );
};
