/**
 * useLocalStorage Hook
 * Generic hook for managing localStorage with React state
 */

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => window.localStorage.setItem(key, JSON.stringify(storedValue)), [storedValue]);

    return [storedValue, setStoredValue];
}
