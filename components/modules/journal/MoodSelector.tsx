import React from 'react';

const MOODS = [
    { value: 'terrible', label: '😫', color: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' },
    { value: 'bad', label: '🙁', color: 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900' },
    { value: 'neutral', label: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    { value: 'good', label: '🙂', color: 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900' },
    { value: 'great', label: '🤩', color: 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900' }
];

interface MoodSelectorProps {
    selectedMood: string;
    onMoodSelect: (mood: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-3">今天的心情如何？</label>
            <div className="flex gap-3 justify-center">
                {MOODS.map(m => (
                    <button
                        key={m.value}
                        type="button"
                        onClick={() => onMoodSelect(m.value)}
                        className={`w-14 h-14 rounded-full text-2xl border-2 transition-all hover:scale-110 active:scale-95 ${
                            selectedMood === m.value
                                ? `${m.color} scale-110 shadow-md`
                                : 'border-muted opacity-40 hover:opacity-100 hover:border-muted-foreground'
                        }`}
                        aria-label={m.value}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export { MOODS };
