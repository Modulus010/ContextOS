/**
 * UI Configuration Constants
 * 包括导航项、文本等
 */

export const ACTIVITY_TYPES = {
    TASK: 'task',
    FOCUS: 'focus',
    JOURNAL: 'journal',
} as const;

export const ACTIVITY_COLORS = {
    task: 'bg-blue-500',
    focus: 'bg-amber-500',
    journal: 'bg-violet-500',
} as const;

export const DASHBOARD_CONFIG = {
    RECENT_ACTIVITIES_LIMIT: 5,
    ANIMATION_DURATION: 200,
} as const;
