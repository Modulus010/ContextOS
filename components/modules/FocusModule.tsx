import React, { useState, useEffect } from 'react';
import { FocusSession, Task } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import { getStartOfDay } from '@/utils';
import { useCreateFocusSession } from '@/hooks/useSupabaseData';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface FocusModuleProps {
    sessions: FocusSession[];
    tasks: Task[];
}

export const FocusModule: React.FC<FocusModuleProps> = ({ sessions, tasks }) => {
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    const createSession = useCreateFocusSession();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => {
                    if (time <= 1) {
                        setIsActive(false);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    // Complete session when timer reaches 0
    useEffect(() => {
        if (timeLeft === 0 && !isActive) {
            completeSession();
        }
    }, [timeLeft, isActive]);

    // Reset timeLeft when duration changes (only when not active)
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration * 60);
        }
    }, [duration]);

    const completeSession = async () => {
        await createSession.mutateAsync({
            durationSeconds: duration * 60,
            completed: true,
            taskId: selectedTaskId || undefined
        });

        setSelectedTaskId(''); // Reset task selection after completion
        if (Notification.permission === 'granted') {
            new Notification("Nexus 专注", { body: "专注时段结束。休息一下吧。" });
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setHasStarted(true); // Mark that timer has been started
        }
        if (!isActive && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setHasStarted(false); // Reset the started flag
        setTimeLeft(duration * 60);
    };

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
    const PRESETS = [15, 25, 50, 90];
    const CIRCUMFERENCE = 2 * Math.PI * 100;

    const focusMinutesToday = Math.floor(
        sessions.filter(s => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            return new Date(s.startedAt) > startOfDay;
        }).reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
    );

    return (
        <Card className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col transition-colors">
            <CardHeader>
                <CardTitle>
                    <HugeiconsIcon icon={Clock01Icon} />
                    深度工作
                </CardTitle>
                <CardDescription>单任务处理以减少认知残留</CardDescription>
            </CardHeader>

            <div className="flex-1 flex flex-col items-center p-6 space-y-6 overflow-y-auto">
                {/* Task Selection */}
                <div className="w-full max-w-xs">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        意图
                    </label>
                    <Select
                        value={selectedTaskId}
                        onValueChange={(val) => setSelectedTaskId(val || '')}
                        disabled={hasStarted}
                    >
                        <SelectTrigger className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-colors">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='None'>无特定任务</SelectItem>
                            {activeTasks.map(t => (
                                <SelectItem key={t.id} value={t.id}>
                                    {t.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Timer UI */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="absolute w-full h-full" viewBox="0 0 224 224" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
                        <g transform="rotate(-90 112 112)">
                            <circle
                                cx="112"
                                cy="112"
                                r="100"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                className="text-slate-100 dark:text-slate-800 transition-colors"
                            />
                            <circle
                                cx="112"
                                cy="112"
                                r="100"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                                className="text-amber-500 transition-all duration-1000 ease-linear"
                            />
                        </g>
                    </svg>
                    <div className="text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 z-10">
                        {formatDuration(timeLeft)}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <Button
                        onClick={toggleTimer}
                        className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${isActive
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                    >
                        {isActive ? <><HugeiconsIcon icon={PauseIcon} className="w-5 h-5" /> 暂停</> : <><HugeiconsIcon icon={PlayIcon} className="w-5 h-5" /> 专注</>}
                    </Button>
                    <Button
                        onClick={resetTimer}
                        className="px-4 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors"
                    >
                        重置
                    </Button>
                </div>

                {/* Duration Customization */}
                <div className={`w-full max-w-xs transition-opacity duration-300 ${hasStarted ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                        时长 : {duration} 分钟
                    </label>

                    <div className="flex justify-between gap-2 mb-3">
                        {PRESETS.map(preset => (
                            <Button
                                key={preset}
                                onClick={() => setDuration(preset)}
                                disabled={hasStarted}
                                className={`flex-1 py-1 rounded text-xs font-medium border transition-colors ${duration === preset
                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700'
                                    }`}
                            >
                                {preset}分
                            </Button>
                        ))}
                    </div>

                    <Slider
                        value={[duration]}
                        onValueChange={(val) => {
                            const newVal = Array.isArray(val) ? val[0] : val;
                            setDuration(Number(newVal));
                        }}
                        min={5}
                        max={120}
                        step={5}
                        aria-label="专注时长（分钟）"
                        disabled={hasStarted}
                    >
                    </Slider>
                </div>

                {/* Stats Snippet */}
                <div className="text-xs text-center text-slate-400">
                    今日专注总时长: {focusMinutesToday} 分钟
                </div>
            </div>
        </Card>
    );
};
