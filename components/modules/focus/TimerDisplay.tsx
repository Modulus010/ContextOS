import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, PauseIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Button } from '@/components/ui/button';

interface TimerDisplayProps {
    hours: number;
    minutes: number;
    seconds: number;
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    hasStarted: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    hours,
    minutes,
    seconds,
    isRunning,
    onToggle,
    onReset,
    hasStarted
}) => {
    const formatDuration = (h: number, m: number, s: number) => {
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="text-center z-10">
                    <div className="text-6xl font-mono font-bold">
                        {formatDuration(hours, minutes, seconds)}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={onToggle}
                    size="lg"
                    className={`px-8 h-14 rounded-full font-semibold transition-all ${isRunning
                            ? 'bg-secondary hover:bg-secondary/80'
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                        }`}
                >
                    <HugeiconsIcon
                        icon={isRunning ? PauseIcon : PlayIcon}
                        className="w-5 h-5 mr-2"
                    />
                    {isRunning ? '暂停' : '开始专注'}
                </Button>
                <Button
                    onClick={onReset}
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-full"
                    disabled={!hasStarted}
                >
                    <HugeiconsIcon icon={RefreshIcon} className="w-5 h-5 mr-2" />
                    结束并重置
                </Button>
            </div>
        </div>
    );
};
