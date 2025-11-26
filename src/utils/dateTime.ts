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
 * Format time for display
 */
export const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Convert seconds to minutes
 */
export const secondsToMinutes = (seconds: number): number => {
    return Math.floor(seconds / 60);
};
