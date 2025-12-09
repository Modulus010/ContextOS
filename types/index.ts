/**
 * Centralized Types Export
 * All type definitions for the application
 */

export enum ContextMode {
    DASHBOARD = 'dashboard',
    TASKS = 'tasks',
    FOCUS = 'focus',
    FINANCE = 'finance',
    JOURNAL = 'journal'
}

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

export enum TaskPriority {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: number;
    completedAt?: number;
    tags: string[];
    subtasks?: Subtask[];
}

export interface FocusSession {
    id: string;
    durationSeconds: number;
    taskId?: string;
    timestamp: number;
    completed: boolean;
}

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense'
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    category: string;
    timestamp: number;
}

export interface JournalEntry {
    id: string;
    content: string;
    mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
    timestamp: number;
    aiReflection?: string;
}

export interface DailyContext {
    date: string;
    tasksCompleted: number;
    focusMinutes: number;
    moneySpent: number;
    mood?: string;
}

export interface GlobalState {
    tasks: Task[];
    focusSessions: FocusSession[];
    transactions: Transaction[];
    journalEntries: JournalEntry[];
}
