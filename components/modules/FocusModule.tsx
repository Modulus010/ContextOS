import React, { useState, useEffect } from 'react';
import { FocusSession, Task } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, PlayIcon, PauseIcon, RefreshIcon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { startOfDay } from 'date-fns';
import { useTimer, useStopwatch } from 'react-timer-hook';
import { useCreateFocusSession } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface FocusModuleProps {
    sessions: FocusSession[];
    tasks: Task[];
}

export const FocusModule: React.FC<FocusModuleProps> = ({ sessions, tasks }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [duration, setDuration] = useState(25);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [isCountUp, setIsCountUp] = useState(false);

    const createSession = useCreateFocusSession();

    const getExpiryTimestamp = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    };

    // 倒计时器
    const {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        isRunning: timerIsRunning,
        start: timerStart,
        pause: timerPause,
        restart: timerRestart,
    } = useTimer({
        expiryTimestamp: getExpiryTimestamp(),
        onExpire: () => handleCountdownExpire(),
        autoStart: false,
    });

    // 正计时器
    const {
        seconds: stopwatchSeconds,
        minutes: stopwatchMinutes,
        hours: stopwatchHours,
        isRunning: stopwatchIsRunning,
        start: stopwatchStart,
        pause: stopwatchPause,
        reset: stopwatchReset,
    } = useStopwatch({ autoStart: false });

    const formatDuration = (h: number, m: number, s: number) => {
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // 当 duration 改变时，更新倒计时器（仅在未开始时）
    useEffect(() => {
        if (!hasStarted) {
            if (duration === 0) {
                // duration 为 0 时，直接进入正计时模式
                setIsCountUp(true);
                stopwatchReset(undefined, false);
            } else {
                // 有时长时，设置倒计时模式
                setIsCountUp(false);
                const time = new Date();
                time.setSeconds(time.getSeconds() + duration * 60);
                timerRestart(time, false);
            }
        }
    }, [duration, hasStarted]);

    const handleCountdownExpire = () => {
        // 倒计时结束，发送通知
        if (Notification.permission === 'granted') {
            new Notification("Nexus 专注", { body: "倒计时结束！现在开始正计时。" });
        }

        // 切换到正计时模式
        setIsCountUp(true);

        // 启动正计时器
        stopwatchReset();
        stopwatchStart();
    };

    const completeSession = async () => {
        // 计算实际专注时长（秒）
        let actualDurationSeconds: number;

        if (isCountUp) {
            // 正计时模式：倒计时时长 + 正计时已过时长
            const countUpElapsed = stopwatchHours * 3600 + stopwatchMinutes * 60 + stopwatchSeconds;
            actualDurationSeconds = duration * 60 + countUpElapsed;
        } else {
            // 倒计时模式：使用已过的时长
            const elapsedSeconds = duration * 60 - (timerMinutes * 60 + timerSeconds);
            actualDurationSeconds = elapsedSeconds;
        }

        await createSession.mutateAsync({
            durationSeconds: actualDurationSeconds,
            completed: true,
            taskId: selectedTaskId || undefined
        });

        setSelectedTaskId('');
    };

    const toggleTimer = () => {
        if (!hasStarted) {
            setHasStarted(true);
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }

        if (isCountUp) {
            // 正计时模式
            if (stopwatchIsRunning) {
                stopwatchPause();
            } else {
                stopwatchStart();
            }
        } else {
            // 倒计时模式
            if (timerIsRunning) {
                timerPause();
            } else {
                timerStart();
            }
        }
    };

    const resetTimer = async () => {
        if (hasStarted) {
            // 完成当前会话
            await completeSession();

            if (Notification.permission === 'granted') {
                new Notification("Nexus 专注", { body: "专注时段已结束并保存。" });
            }
        }

        // 重置所有状态
        setHasStarted(false);
        if (duration === 0) {
            setIsCountUp(true);
            stopwatchReset(undefined, false);
        } else {
            setIsCountUp(false);
            stopwatchReset(undefined, false);
            const time = new Date();
            time.setSeconds(time.getSeconds() + duration * 60);
            timerRestart(time, false);
        }
    };

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const PRESETS = [0, 15, 25, 50, 90];

    // 计算当前显示的时间（倒计时或正计时）
    const displayHours = isCountUp ? stopwatchHours : timerHours;
    const displayMinutes = isCountUp ? stopwatchMinutes : timerMinutes;
    const displaySeconds = isCountUp ? stopwatchSeconds : timerSeconds;
    const isRunning = isCountUp ? stopwatchIsRunning : timerIsRunning;

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

                            <div className="text-center z-10">
                                <div className="text-6xl font-mono font-bold">
                                    {formatDuration(displayHours, displayMinutes, displaySeconds)}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={toggleTimer}
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
                                onClick={resetTimer}
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

                    <Separator className="my-8" />

                    {/* Duration Customization */}
                    <div className={`w-full space-y-4 transition-opacity duration-300 ${hasStarted ? 'opacity-40 pointer-events-none' : 'opacity-100'
                        }`}>
                        <label className="block text-sm font-medium text-center">
                            {duration === 0 ? '正计时模式' : `专注时长：${duration} 分钟`}
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
                                    {preset === 0 ? '正计时' : `${preset}分`}
                                </Button>
                            ))}
                        </div>

                        <Slider
                            value={[duration]}
                            onValueChange={(val) => {
                                const newVal = Array.isArray(val) ? val[0] : val;
                                setDuration(Number(newVal));
                            }}
                            min={0}
                            max={120}
                            step={5}
                            aria-label="专注时长（分钟）"
                            disabled={hasStarted}
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
