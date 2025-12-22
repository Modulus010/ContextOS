/**
 * Centralized Types Export
 * All type definitions for the application
 * 
 * Use uppercase constants, e.g.:
 * - TaskStatus.TODO (value: 'todo')
 * - TaskPriority.HIGH (value: 'high')
 * - TransactionType.INCOME (value: 'income')
 * 
 * @see lib/validation/schemas.ts
 */

import { z } from 'zod';
import {
    TaskStatusSchema,
    TaskPrioritySchema,
    TransactionTypeSchema,
    ContextModeSchema,
    MoodSchema
} from '@/lib/validation/schemas';

// Export enum constants
export {
    TaskStatus,
    TaskPriority,
    TransactionType,
    ContextMode,
    Mood,
} from '@/lib/validation/schemas';
// Re-export types (inferred from Zod schemas)
export type {
    Subtask,
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    FocusSession,
    CreateFocusSessionInput,
    UpdateFocusSessionInput,
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
    JournalEntry,
    CreateJournalEntryInput,
    UpdateJournalEntryInput,
    DailyContext,
    GlobalState,
} from '@/lib/validation/schemas';

// Re-export schemas for validation
export {
    TaskSchema,
    CreateTaskSchema,
    UpdateTaskSchema,
    FocusSessionSchema,
    CreateFocusSessionSchema,
    UpdateFocusSessionSchema,
    TransactionSchema,
    CreateTransactionSchema,
    UpdateTransactionSchema,
    JournalEntrySchema,
    CreateJournalEntrySchema,
    UpdateJournalEntrySchema,
    GlobalStateSchema,
    TaskStatusSchema,
    TaskPrioritySchema,
    TransactionTypeSchema,
    ContextModeSchema,
    MoodSchema,
} from '@/lib/validation/schemas';

// Type aliases for convenience
export type TaskStatusType = z.infer<typeof TaskStatusSchema>;
export type TaskPriorityType = z.infer<typeof TaskPrioritySchema>;
export type TransactionTypeType = z.infer<typeof TransactionTypeSchema>;
export type ContextModeType = z.infer<typeof ContextModeSchema>;
export type MoodType = z.infer<typeof MoodSchema>;
