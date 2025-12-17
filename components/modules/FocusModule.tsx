import React, { useState, useEffect } from 'react';
import { FocusSession, Task } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, PlayIcon, PauseIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { getStartOfDay } from '@/utils';
import { useCreateFocusSession } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <HugeiconsIcon icon={Clock01Icon} className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">深度工作</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                单任务处理以减少认知残留
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                        今日 {focusMinutesToday} 分钟
                    </Badge>
                </div>
            </div>

            <Separator />

            <Card>
                <CardContent className="p-8">{/* Task Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-3">
                            当前意图
                        </label>
                        <Select
                            value={selectedTaskId}
                            onValueChange={(val) => setSelectedTaskId(val || '')}
                            disabled={hasStarted}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="选择一个任务或无特定任务" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='None'>🎯 无特定任务</SelectItem>
                                {activeTasks.map(t => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="my-8" />

                    {/* Timer UI */}
                    <div className="flex flex-col items-center space-y-8">
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="112"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-muted/30"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="112"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                                    className="text-amber-500 transition-all duration-1000 ease-linear"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-center z-10">
                                <div className="text-6xl font-mono font-bold mb-2">
                                    {formatDuration(timeLeft)}
                                </div>
                                <Progress value={progress} className="w-32 h-1" />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={toggleTimer}
                                size="lg"
                                className={`px-8 h-14 rounded-full font-semibold transition-all ${isActive
                                        ? 'bg-secondary hover:bg-secondary/80'
                                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                                    }`}
                            >
                                <HugeiconsIcon
                                    icon={isActive ? PauseIcon : PlayIcon}
                                    className="w-5 h-5 mr-2"
                                />
                                {isActive ? '暂停' : '开始专注'}
                            </Button>
                            <Button
                                onClick={resetTimer}
                                variant="outline"
                                size="lg"
                                className="h-14 rounded-full"
                                disabled={!hasStarted}
                            >
                                <HugeiconsIcon icon={RefreshIcon} className="w-5 h-5 mr-2" />
                                重置
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Duration Customization */}
                    <div className={`w-full space-y-4 transition-opacity duration-300 ${hasStarted ? 'opacity-40 pointer-events-none' : 'opacity-100'
                        }`}>
                        <label className="block text-sm font-medium text-center">
                            专注时长：{duration} 分钟
                        </label>

                        <div className="flex justify-center gap-2 mb-4">
                            {PRESETS.map(preset => (
                                <Button
                                    key={preset}
                                    onClick={() => setDuration(preset)}
                                    disabled={hasStarted}
                                    variant={duration === preset ? "default" : "outline"}
                                    size="sm"
                                    className={duration === preset ? 'bg-amber-500 hover:bg-amber-600' : ''}
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
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50">
                <CardContent className="p-4">
                    <p className="text-sm text-center text-amber-900 dark:text-amber-200">
                        💡 专注模式将帮助你进入心流状态，建议每次至少专注 25 分钟
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
