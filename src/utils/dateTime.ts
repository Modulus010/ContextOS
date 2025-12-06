/**
 * Date and Time Utility Functions
 */

/**
 * Get start of day timestamp
 */
export const getStartOfDay = (date: Date = new Date()): number => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d.getTime();
};

/**
 * Get end of day timestamp
 */
export const getEndOfDay = (date: Date = new Date()): number => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return d.getTime() - 1;
};

/**
 * Format timestamp for display with time, date, and optional year
 * Shows HH:MM 月DD format, and adds year if different from current year
 */
export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const currentYear = now.getFullYear();
    const dateYear = date.getFullYear();

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const timeStr = `${hours}:${minutes}`;
    const dateStr = `${month}/${day}`;

    if (dateYear !== currentYear) {
        return `${dateYear}/${dateStr} ${timeStr}`;
    }

    return `${dateStr} ${timeStr}`;
};

/**
 * Convert seconds to minutes
 */
export const secondsToMinutes = (seconds: number): number => {
    return Math.floor(seconds / 60);
};
