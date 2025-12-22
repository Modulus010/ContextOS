/**
 * Zod Validation Schemas
 * Runtime type validation for all data models
 * 
 * Pattern: Define const objects first, then create schemas from them
 * Usage: TaskStatus.TODO, TaskPriority.HIGH, etc.
 */

import { z } from 'zod';

// Const objects with uppercase keys and lowercase values
export const ContextMode = {
    DASHBOARD: 'dashboard',
    TASKS: 'tasks',
    FOCUS: 'focus',
    FINANCE: 'finance',
    JOURNAL: 'journal',
} as const;

export const TaskStatus = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
} as const;

export const TaskPriority = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
} as const;

export const TransactionType = {
    INCOME: 'income',
    EXPENSE: 'expense',
} as const;

export const Mood = {
    GREAT: 'great',
    GOOD: 'good',
    NEUTRAL: 'neutral',
    BAD: 'bad',
    TERRIBLE: 'terrible',
} as const;

// Zod schemas built from the const objects
export const ContextModeSchema = z.nativeEnum(ContextMode);
export const TaskStatusSchema = z.nativeEnum(TaskStatus);
export const TaskPrioritySchema = z.nativeEnum(TaskPriority);
export const TransactionTypeSchema = z.nativeEnum(TransactionType);
export const MoodSchema = z.nativeEnum(Mood);

// Subtask Schema
export const SubtaskSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "子任务标题不能为空"),
    completed: z.boolean().default(false),
});

// Task Schema
export const TaskSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "任务标题不能为空"),
    status: TaskStatusSchema,
    priority: TaskPrioritySchema,
    createdAt: z.string().datetime({ offset: true }),
    completedAt: z.string().datetime({ offset: true }).optional(),
    deadline: z.string().datetime({ offset: true }).optional(),
    tags: z.array(z.string()).default([]),
    subtasks: z.array(SubtaskSchema).default([]),
});

// Create Task Input (without id and createdAt)
export const CreateTaskSchema = TaskSchema.omit({
    id: true,
    createdAt: true,
});

// Update Task Input (all fields optional except id)
export const UpdateTaskSchema = TaskSchema.partial().required({ id: true });

// Focus Session Schema
export const FocusSessionSchema = z.object({
    id: z.string().uuid(),
    durationSeconds: z.number().int().positive(),
    taskId: z.string().uuid().optional(),
    startedAt: z.string().datetime({ offset: true }),
    completed: z.boolean(),
});

export const CreateFocusSessionSchema = FocusSessionSchema.omit({
    id: true,
    startedAt: true,
});

export const UpdateFocusSessionSchema = FocusSessionSchema.partial().required({ id: true });

// Transaction Schema
export const TransactionSchema = z.object({
    id: z.string().uuid(),
    amount: z.number().positive(),
    description: z.string().min(1, "描述不能为空"),
    type: TransactionTypeSchema,
    category: z.string().min(1, "分类不能为空"),
    timestamp: z.string().datetime({ offset: true }),
});

export const CreateTransactionSchema = TransactionSchema.omit({
    id: true,
    timestamp: true,
});

export const UpdateTransactionSchema = TransactionSchema.partial().required({ id: true });

// Journal Entry Schema
export const JournalEntrySchema = z.object({
    id: z.string().uuid(),
    content: z.string().min(1, "日志内容不能为空"),
    mood: MoodSchema,
    timestamp: z.string().datetime({ offset: true }),
    aiReflection: z.string().optional(),
});

export const CreateJournalEntrySchema = JournalEntrySchema.omit({
    id: true,
    timestamp: true,
});

export const UpdateJournalEntrySchema = JournalEntrySchema.partial().required({ id: true });

// Daily Context Schema
export const DailyContextSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式必须为 YYYY-MM-DD"),
    tasksCompleted: z.number().int().nonnegative(),
    focusMinutes: z.number().int().nonnegative(),
    moneySpent: z.number().nonnegative(),
    mood: z.string().optional(),
});

// Global State Schema
export const GlobalStateSchema = z.object({
    tasks: z.array(TaskSchema),
    focusSessions: z.array(FocusSessionSchema),
    transactions: z.array(TransactionSchema),
    journalEntries: z.array(JournalEntrySchema),
});

// Type exports (inferred from schemas)
export type ContextMode = z.infer<typeof ContextModeSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type Mood = z.infer<typeof MoodSchema>;

export type Subtask = z.infer<typeof SubtaskSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export type FocusSession = z.infer<typeof FocusSessionSchema>;
export type CreateFocusSessionInput = z.infer<typeof CreateFocusSessionSchema>;
export type UpdateFocusSessionInput = z.infer<typeof UpdateFocusSessionSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type CreateJournalEntryInput = z.infer<typeof CreateJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof UpdateJournalEntrySchema>;

export type DailyContext = z.infer<typeof DailyContextSchema>;
export type GlobalState = z.infer<typeof GlobalStateSchema>;
